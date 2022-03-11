const { Satellite, logger } = require('@senecacdot/satellite');
const { static: serveStatic } = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const fs = require('fs/promises');
const getPackage = require('get-repo-package-json');
const { check } = require('./services.js');
const getGitHubData = require('./js/github-stats.js');
const getFeedCount = require('./js/feed-stats.js');
const getPostsCount = require('./js/posts-stats.js');
const getJobCount = require('./js/queue-stats.js');

// We need to be able to talk to the autodeployment server
const autodeploymentHost = process.env.WEB_URL || 'localhost';

/**
 * @returns {Object} Vite manifest https://vitejs.dev/guide/backend-integration.html
 */
const readViteManifest = async () => {
  const manifestBuffer = await fs.readFile(path.join(__dirname, '../public/dist/manifest.json'));
  return JSON.parse(manifestBuffer);
};

/**
 * @param {string} filePath a key in manifest.json of Vite
 * @returns {Promise<string>} the path to the bundled js file
 */
const getDistJsPath = async (filePath) => {
  const manifest = await readViteManifest();
  return `dist/${manifest[filePath].file}`;
};

const satelliteOptions = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", '*.fontawesome.com', 'cdn.jsdelivr.net'],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          '*.fontawesome.com',
          'fonts.googleapis.com',
          'cdn.jsdelivr.net',
        ],
        connectSrc: ["'self'", '*.fontawesome.com', autodeploymentHost, '*.github.com'],
        fontSrc: ["'self'", 'data:', 'https:', '*.fontawesome.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  },
  healthCheck: async (req, res) => {
    const sha = process.env.GIT_COMMIT || 'master';
    const gitHubUrl = `https://github.com/Seneca-CDOT/telescope/commit/${sha}`;
    const { version } = await getPackage('https://github.com/Seneca-CDOT/telescope/blob/master/');

    res.set('Cache-Control', 'public, max-age=300');

    return {
      version,
      sha,
      gitHubUrl,
    };
  },
};

const service = new Satellite(satelliteOptions);
service.app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    helpers: {
      formatNumber(numberLike) {
        // Coerce to Number if it is a String.
        // If numberLike is a Number, then the operation is idempotent.
        // If it cannot be coerced to a Number, then it is NaN.
        const number = +numberLike;
        if (Number.isNaN(number)) {
          return numberLike;
        }
        return new Intl.NumberFormat().format(number);
      },
    },
  })
);
service.app.set('view engine', 'hbs');
service.app.set('views', path.join(__dirname, '/views'));

// Static assets
service.router.use('/', serveStatic(path.join(__dirname, '../public')));

// Microservices status check
service.router.get('/status', (req, res) => {
  check()
    .then((status) => {
      // This status response shouldn't be cached (we need current status info)
      res.set('Cache-Control', 'no-store, max-age=0');
      return res.json(status);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Home page
service.router.get('/', async (req, res) => {
  try {
    const [telescope, satellite, totalPost, totalFeeds, jobCount, distJsPath] = await Promise.all([
      getGitHubData('Seneca-CDOT', 'telescope'),
      getGitHubData('Seneca-CDOT', 'satellite'),
      getPostsCount(),
      getFeedCount(),
      getJobCount(),
      getDistJsPath('public/js/pages/dashboard.js'),
    ]);
    let environment = {};
    if (process.env.STATUS_URL === 'https://api.telescope.cdot.systems/v1/status')
      environment = { name: 'production', staging: false };
    else environment = { name: 'staging', staging: true };

    return res.render('status', {
      dist_js_path: distJsPath,
      active_dashboard: true,
      headers: { title: 'Telescope Dashboard' },
      telescope: { ...telescope, title: 'Telescope' },
      satellite: { ...satellite, title: 'Satellite' },
      totalPost,
      totalFeeds,
      jobCount,
      environment,
    });
  } catch (error) {
    logger.warn({ error }, 'Fail to fetch data');
  }

  return res.status(500).send('Fail to render /');
});

// Get Build page
service.router.get('/build', async (req, res) => {
  try {
    const distJsPath = await getDistJsPath('public/js/pages/build.js');

    return res.render('builds', {
      dist_js_path: distJsPath,
      active_build_log: true,
      headers: { title: 'Telescope Build log' },
    });
  } catch (error) {
    logger.warn({ error }, 'Fail to get dist/js path');
  }

  return res.status(500).send('Fail to render /build');
});

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port, () => {
  logger.info(`Server started on port ${port}`);
});
