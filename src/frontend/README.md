# Telescope Frontend Development

## Introduction

Telescope is in the process of porting the front-end from [GatsbyJS](https://www.gatsbyjs.org/)
to [Next.js](https://nextjs.org), see https://github.com/Seneca-CDOT/telescope/issues/1316.

To facilitate this conversion, we are hosting both front-ends in the `src/frontend` folder. For
the time being, the root npm scripts will default to run the GatsbyJS front-end. However, when
we finish the conversion, we'll switch that to Next.js and delete the GatsbyJS code.

NOTE: if you are only working on the front-end code, set `PROXY_FRONTEND=1` in your `.env` to use
the development server (https://dev.telescope.cdot.systems) as your back-end.

## Running Next.js

From the root of the project, you can run a number of GatsbyJS specific npm scripts:

1. [`npm run develop:next`](https://nextjs.org/docs/api-reference/cli#development) to start the development server
1. [`npm run build:next`]() to build the site in `src/frontend/next/build` for production
1. [`npm run serve:next`](https://nextjs.org/docs/api-reference/cli#production) to serve the production site in `src/frontend/next/.next` for testing
