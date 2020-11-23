## Frontend Development with GatsbyJS

The Telescope GatsbyJS frontend app lives in [`src/frontend/gatsby`](../src/frontend/gatsby) and is
built using the React frontend framework [GatsbyJS](https://www.gatsbyjs.org/).
You are encouraged to read the [GatsbyJS docs](https://www.gatsbyjs.org/docs/)
in order to understand how everything works, and what the [files and folders](https://www.gatsbyjs.org/docs/gatsby-project-structure/#folders) mean.

From the root of the project, you can run a number of GatsbyJS specific npm scripts:

1. [`npm run develop`](https://www.gatsbyjs.org/docs/gatsby-cli/#develop) to start the development server
1. [`npm run build`](https://www.gatsbyjs.org/docs/gatsby-cli/#build) to build the site in `src/frontend/gatsby/public` for production
1. [`npm run serve`](https://www.gatsbyjs.org/docs/gatsby-cli/#serve) to serve the production site in `src/frontend/gatsby/public` for testing
1. [`npm run clean`](https://www.gatsbyjs.org/docs/gatsby-cli/#clean) to delete generated build files and folders

## Running our Frontend With and Without our Backend

If you're only working on the frontend, you might not want to run our Redis
server, login server, node app, etc. There are a few ways to run the
frontend, which depends on having access to a backend API and authentication provider.

### 1. Frontend and Backend Locally with Docker Compose

If you want to run the full app (frontend and backend) locally, the easiest way
is to use Docker Compose, which is what our deployment boxes do. This method
is also the most resource intensive, and may not make sense if your laptop
is underpowered:

```
docker-compose up --build
```

See the instructions for setup in our [Environment Setup docs](environment-setup.md).
If you change something, and want to re-build the frontend, you can stop the apps
and re-run the command above.

### 2. Frontend With Gatsby Dev Server and Local Backend with Docker

In your `.env` file, you need to make a few changes:

1. set `API_URL=http://localhost:3000` to tell the frontend to connect to a backend API server running at `http://localhost:3000`.
2. set `PROXY_GATSBY=1` so that our node server will proxy the frontend to the Gatsby development server

Now you need to run Redis (natively or via docker-compose, see [Environment Setup docs](environment-setup.md)), then start the node app natively:

```
docker-compose up redis
npm start
```

In a second terminal, start the Gatsby dev server:

```
npm run develop
```

Browse to `http://localhost:3000/`. The backend will proxy the Gatsby app with hot-reloading from `http://localhost:8000`.

### 3. Frontend With Gatsby Dev Server and Staging Server Backend

This is the easiest way to run your Gatsby development environment if you don't
care about making changes to the backend. It also means you need fewer computing
resources to run the app.

In your `.env` file, set `API_URL=https://dev.telescope.cdot.systems` to tell
the frontend to connect to a backend API server running on our staging server.
This is also how we do things on Zeit Now at `https://telescope-dusky.now.sh/`

Start the Gatsby dev server:

```
npm run develop
```

This will run the Gatsby app with hot-reloading on `http://localhost:8000` and
use `https://dev.telescope.cdot.systems` as your back-end. Any changes made to the code in the front-end will now be reflected on `http://localhost:8000`

Please note `npm run develop` will detect 99% of any issues that may occur when working on the front-end. It is highly advised to run `npm run build` to verify there are no issues.

Please also note `npm run build` AND a running local back-end(API_URL=http://localhost:3000) is required to use the login functions of Telescope.
