const path = require(`path`);
const fs = require('fs').promises;
const fetch = require('node-fetch');

exports.onPreInit = async function () {
  const clientId = process.env.unsplashClientId || '';
  const collectionId = process.env.collectionId || '9975402';

  const frontEndPath = path.join('src', 'images', 'backgrounds');

  if (clientId && collectionId) {
    const response = await fetch(
      `https://api.unsplash.com/collections/${collectionId}/photos/?client_id=${clientId}&per_page=100`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();

    for (const photo of data) {
      const downloadUrl = photo.urls.raw;
      const fileName = `${frontEndPath}/${photo.id}.jpg`;

      try {
        fs.accessSync(fileName, 400);
      } catch (err) {
        // We expect it not to exist on deploys.
        await fetch(downloadUrl)
          .then((res) => res.buffer())
          .then((buffer) => fs.writeFile(`${frontEndPath}/${photo.id}.jpg`, buffer))
          .catch((imgErr) => console.error(imgErr));
      }
    }
  }
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
