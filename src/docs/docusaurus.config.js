// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Telescope',
  tagline: "A tool for tracking blogs in orbit around Seneca's open source involvement",
  url: 'https://telescope.cdot.systems',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'seneca-cdot', // Usually your GitHub org/user name.
  projectName: 'telescope', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/Seneca-CDOT/telescope/tree/master/src/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Telescope',
        logo: {
          alt: 'Telescope Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'overview',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/Seneca-CDOT/telescope',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'Telescope Website',
                to: 'https://telescope.cdot.systems/',
              },
              {
                label: 'Telescope Mobile Apps',
                to: 'https://telescope.cdot.systems/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'System Status',
                href: 'https://api.telescope.cdot.systems/v1/status/',
              },
              {
                label: 'License',
                href: 'https://github.com/Seneca-CDOT/telescope/blob/master/LICENSE',
              },
              {
                label: 'Planet CDOT Feeds',
                href: 'https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List',
              },
            ],
          },
          {
            title: 'Developers',
            items: [
              {
                label: 'Documentation',
                href: 'https://docusaurus.io/docs/',
              },
              {
                label: 'Slack',
                href: 'https://seneca-open-source.slack.com/archives/CS5DGCAE5',
              },
              {
                label: 'Github',
                href: 'https://github.com/Seneca-CDOT/telescope',
              },
              {
                label: 'Staging Server',
                href: 'https://dev.telescope.cdot.systems/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <br>
        Telescope, Seneca's Centre for Development of Open Technology.<br>
        Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
