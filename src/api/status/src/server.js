const { Satellite } = require('@senecacdot/satellite');
const { static: serveStatic } = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const { check } = require('./services');
const getGitHubData = require('./js/github-stats');
const getFeedCount = require('./js/feed-stats');
const getPostsCount = require('./js/posts-stats');
const getJobCount = require('./js/queue-stats');

const host = process.env.API_HOST || 'localhost';

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
        connectSrc: [
          "'self'",
          '*.fontawesome.com',
          `${host.replace(/(^\w+:|^)\/\//, '')}:4000`,
          '*.github.com',
        ],
        fontSrc: ["'self'", 'data:', 'https:', '*.fontawesome.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
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
  })
);
service.app.set('view engine', 'hbs');
service.app.set('views', path.join(__dirname, '/views'));

// If a PATH_PREFIX is defined, serve our static content there, and redirect / -> PATH_PREFIX.
// We do this in development to extra path routing that Traefik adds in production (e.g., /v1/status/*)
if (process.env.PATH_PREFIX) {
  service.router.use(process.env.PATH_PREFIX, serveStatic(path.join(__dirname, '../public')));
  service.router.get('/', (req, res) => {
    res.redirect(process.env.PATH_PREFIX);
  });
} else {
  service.router.use('/', serveStatic(path.join(__dirname, '../public')));
}

service.router.get(`${process.env.PATH_PREFIX || ''}/status`, (req, res) => {
  check()
    .then((status) => {
      // This status response shouldn't be cached (we need current status info)
      res.set('Cache-Control', 'no-store, max-age=0');
      return res.json(status);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Get Home page
service.router.get(process.env.PATH_PREFIX || '/', async (req, res) => {
  let telescope;
  let satellite;
  let totalPost;
  let totalFeeds;
  let jobCount;
  try {
    [telescope, satellite, totalPost, totalFeeds, jobCount] = await Promise.all([
      getGitHubData('Seneca-CDOT', 'telescope'),
      getGitHubData('Seneca-CDOT', 'satellite'),
      getPostsCount(),
      getFeedCount(),
      getJobCount(),
    ]);
  } catch (e) {
    console.error(e);
  }
  let environment = {};
  if (process.env.STATUS_URL === 'https://api.telescope.cdot.systems/v1/status')
    environment = { name: 'production', staging: false };
  else environment = { name: 'staging', staging: true };

  res.render('status', {
    active_dashboard: true,
    headers: { title: 'Telescope Dashboard' },
    telescope: { ...telescope, title: 'Telescope' },
    satellite: { ...satellite, title: 'Satellite' },
    totalPost,
    totalFeeds,
    jobCount,
    environment,
  });
});

// Get Build page
service.router.get(`${process.env.PATH_PREFIX || ''}/build`, (req, res) => {
  res.render('builds', { active_build_log: true, headers: { title: 'Telescope Build log' } });
});

const port = parseInt(process.env.STATUS_PORT || 1111, 10);
service.start(port);
