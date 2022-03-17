# NEXT_PUBLIC_API_URL is needed by the next.js build, which we define
# as a build ARG in API_URL.  NOTE: if you add or change anything to
# these build args, also update .github/workflows/docker-build-and-push.yml
# and the workflows that call it.
ARG API_URL
# API Service URLs, set via ENV in docker or next build
ARG IMAGE_URL
ARG SSO_URL
ARG POSTS_URL
ARG SEARCH_URL
ARG FEED_DISCOVERY_URL
ARG STATUS_URL
# Front-end Web URL, set via ENV in docker or next build
ARG WEB_URL

## Base ########################################################################
FROM node:lts-alpine as base

# Tini Entrypoint for Alpine
# util-linux required to optimize builds using multiple cores
RUN apk add --no-cache tini util-linux
ENTRYPOINT [ "/sbin/tini", "--"]

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Install pnpm
RUN npm install -g pnpm

WORKDIR /frontend
COPY ./app .

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/docusaurus
# Copy the source code over
COPY --chown=node:node ./docusaurus /home/node/docusaurus/

## Development #################################################################
# Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/docusaurus
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN pnpm install
# Switch to the node user vs. root
USER node
# Expose port 4631
EXPOSE 4631
# Start the app in debug mode so we can attach the debugger
CMD ["pnpm", "start"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/docusaurus

COPY --chown=node:node --from=development /home/node/docusaurus/node_modules /home/node/docusaurus/node_modules
# Build the Docusaurus app
RUN pnpm build

## Dependencies ################################################################
FROM base as dependencies

# Copy the various API URLs build args over so next.js can see them in next.config.js
ARG API_URL
ENV NEXT_PUBLIC_API_URL ${API_URL}

ARG IMAGE_URL
ENV NEXT_PUBLIC_IMAGE_URL ${IMAGE_URL}

ARG SSO_URL
ENV NEXT_PUBLIC_SSO_URL ${SSO_URL}

ARG POSTS_URL
ENV NEXT_PUBLIC_POSTS_URL ${POSTS_URL}

ARG SEARCH_URL
ENV NEXT_PUBLIC_SEARCH_URL ${SEARCH_URL}

ARG FEED_DISCOVERY_URL
ENV NEXT_PUBLIC_FEED_DISCOVERY_URL ${FEED_DISCOVERY_URL}

ARG STATUS_URL
ENV NEXT_PUBLIC_STATUS_URL ${STATUS_URL}}

ARG WEB_URL
ENV NEXT_PUBLIC_WEB_URL ${WEB_URL}

WORKDIR /frontend

RUN pnpm install
# Build the web app
RUN pnpm build

## Build ########################################################################
FROM nginx:stable-alpine as build

COPY --from=dependencies /frontend/out /var/www/data

# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/docusaurus/build /usr/share/nginx/html/
