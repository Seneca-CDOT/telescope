## Frontend Development with GatsbyJS

The Telescope frontend app lives in [`src/frontend`](../src/frontend) and is
built using the React frontend framework [GatsbyJS](https://www.gatsbyjs.org/).
You are encouraged to read the [GatsbyJS docs](https://www.gatsbyjs.org/docs/)
in order to understand how everything works, and what the [files and folders](https://www.gatsbyjs.org/docs/gatsby-project-structure/#folders) mean.

From the root of the project, you can run a number of GatsbyJS specific npm scripts:

1. [`npm run develop`](https://www.gatsbyjs.org/docs/gatsby-cli/#develop) to start the development server
1. [`npm run build`](https://www.gatsbyjs.org/docs/gatsby-cli/#build) to build the site in `src/frontend/public` for production
1. [`npm run serve`](https://www.gatsbyjs.org/docs/gatsby-cli/#serve) to serve the production site in `src/frontend/public` for testing
1. [`npm run clean`](https://www.gatsbyjs.org/docs/gatsby-cli/#clean) to delete generated build files and folders

## Running Backend and Frontend without Docker

If you need to run the backend and frontend together, but aren't using Docker,
you can do the following.

In one terminal, start the backend server:

```
npm start
```

In a second terminal, start the Gatsby development server:

```
npm run develop
```

You can now browse to `http://localhost:8000`, and it will proxy requests to the
backend automatically for you. For example, you can use `http://localhost:8000/posts`
to get a list of all posts.

## Simulating Login

The authentication system for Telescope is complicated to setup, and if you only
need to work on the UI, it can be easier to simulate it.

To run a mock authentication backend, set the following environment variable
in your `.env`:

```
MOCK_SSO=1
```
