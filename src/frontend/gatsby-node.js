const path = require(`path`);
const fs = require('fs').promises;
const fetch = require('node-fetch');

async function downloadPhoto(url, filename) {
  const res = await fetch(url);
  const buf = await res.buffer();
  await fs.writeFile(filename, buf);
}

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

exports.onPreInit = async function () {
  const clientId = process.env.unsplashClientId || '';
  const collectionId = process.env.collectionId || '9975402';

  const frontEndPath = path.join('src', 'images', 'backgrounds');

  if (!(clientId && collectionId)) {
    return;
  }

  // Get the list of photos from our Unsplash.com collection
  const res = await fetch(
    `https://api.unsplash.com/collections/${collectionId}/photos/?client_id=${clientId}&per_page=100`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const photos = await res.json();

  // Process this list, since we only need to download photos we don't already have locally
  const downloads = photos
    .map((photo) => ({
      filename: path.join(frontEndPath, `${photo.id}.jpg`),
      url: photo.urls.raw,
    }))
    .filter(shouldDownload);

  // Download any photos we don't have
  await Promise.all(downloads.map(({ url, filename }) => downloadPhoto(url, filename)));
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
