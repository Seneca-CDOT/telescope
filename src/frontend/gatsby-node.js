const path = require(`path`);
const fs = require('fs').promises;
const fetch = require('node-fetch');

/**
 * Download the image at `url` and write to `filename`
 * @param {String} url - the URL to the image
 * @param {String} filename - the local filename to use when writing
 */
async function downloadPhoto(url, filename) {
  const res = await fetch(url);
  const buf = await res.buffer();
  await fs.writeFile(filename, buf);
}

/**
 * Check if the given filename is already available locally
 * @param {String} filename - filename for image
 */
async function shouldDownload(filename) {
  try {
    await fs.access(filename, fs.FS_OK);
    // File already exists, skip
    return false;
  } catch (err) {
    // No such file, we need it
    return true;
  }
}

/**
 * Download all Unsplash.com images defined in the given collection
 * @param {Object} reporter - Gatsby reporter
 * @param {String} clientId - Unsplash.com client id
 * @param {String} collectionId - Unsplash.com collection id
 */
async function downloadUnsplashCollection(reporter, clientId, collectionId) {
  const frontEndPath = path.join('src', 'images', 'backgrounds');

  // Get the list of photos from our Unsplash.com collection
  let photos;
  try {
    const res = await fetch(
      `https://api.unsplash.com/collections/${collectionId}/photos/?client_id=${clientId}&per_page=100`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    photos = await res.json();

    // We expect Unsplash to a return an array with photo info. Bail if it doesn't.
    if (!Array.isArray(photos)) {
      throw new Error('received unexpected photo data from Unsplash.com');
    }
  } catch (err) {
    reporter.error('Unable to download Unsplash.com image collection metadata', err);
    return;
  }

  // Process this list, since we only need to download photos we don't already have locally
  const downloads = photos
    .map((photo) => ({
      filename: path.join(frontEndPath, `${photo.id}.jpg`),
      url: photo.urls.raw,
    }))
    .filter(shouldDownload);

  // Download any photos we don't have
  try {
    await Promise.all(downloads.map(({ url, filename }) => downloadPhoto(url, filename)));
  } catch (err) {
    reporter.error('Error Unable to download Unsplash.com image(s)', err);
  }
}

exports.onPreInit = async function ({ reporter }) {
  const clientId = process.env.UNSPLASH_CLIENT_ID;
  const collectionId = process.env.UNSPLASH_COLLECTION_ID || '9975402';
  if (!clientId) {
    reporter.info('No Unsplash Client ID specified in environment, skipping download');
    return;
  }

  await downloadUnsplashCollection(reporter, clientId, collectionId);
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const pageTemplate = path.resolve(`src/templates/template.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC }, limit: 1000) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: pageTemplate,
      context: {}, // additional data can be passed via context
    });
  });
};
