---
sidebar_position: 7
---

# Status Service

## Overview

Status service displays various metrics about Telescope and is also referred to as **The dashboard**. It is not written using React, but has other frameworks. For HTML [Handlebars](https://handlebarsjs.com) is used to divide content into smaller and more manageable views. For CSS the following extensions are used: [SASS](https://sass-lang.com) and [Material Dashboard](https://www.creative-tim.com/learning-lab/bootstrap/overview/material-dashboard).

:::note

The dashboard is somewhat of a "sanctuary" development environment for those that prefer to not deal with React

:::

## Setup

```bash
# Install dependencies
pnpm install
```

```bash
# Go to the status service directory
cd src/api/status
```

```bash
# Boot up website and server
pnpm dev
```

The website is live at `localhost:1111`

### SCSS

After making changes to `scss` files, run

```bash
# Compile scss to css
pnpm compile:scss
```

Optionally: watch for scss changes

```bash
# If your IDE stuck at saving files, go with manually compiling scss
pnpm watch:scss
```

## Views

There are views for separate pages and partial views which are composite components to be mixed and matched. Each view has a `.hbs` file extension. The starting point is `elescope/src/api/status/src/views/layouts/main.hbs`.

#### Main views:

- **Status**: Consists of **Card partials** and the **API status board**. This is the current default page.
- **Builds**: A build log of Telescope Production.

#### Partials:

- **Sidebar**: A navigation bar that has links to views and different Telescope deployments.
- **Header**: A templated header that changes contents based on which page you are on.
- **API Status board**: Displays a list of Telescope's API services along with their status. If a certain part of Telescope isn't working, you would find out from this list.
- **Cards**: Displays a single and specific statistic in a view of a "card". There are various cards with different information on them.

## API status board

`telescope/src/api/status/src/services.js` specifically fetches each service's status to display it on the dashboard. Currently, it requests status on the following services:

- `parser`
- `sso`
- `image`
- `posts`
- `feed-discovery`
- `search`
- `telescope`
- `autodeployment`
- `dependency-discovery`
- `rss-bridge`
- `docusaurus`

If the request gets a proper response in time, then the service is displayed to be working.

:::info

If you run the dashboard on a staging branch, it will display you status of services specifically on staging.

:::
