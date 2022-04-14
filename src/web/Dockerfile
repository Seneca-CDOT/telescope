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
ARG DEPENDENCY_DISCOVERY_URL
# Front-end Web URL, set via ENV in docker or next build
ARG WEB_URL
ARG SUPABASE_URL
ARG ANON_KEY

## Base ###########################################################################
FROM node:16 as base

RUN npm install -g pnpm

## Dependencies ###################################################################
## Telescope app
FROM base as dependencies-app

WORKDIR /app

COPY ./app/package.json ./

RUN pnpm install

## Telescope docs
FROM base as dependencies-docs

WORKDIR /docs

COPY ./docusaurus/package.json ./

RUN pnpm install

## Build ######################################################################
## Telescope app
FROM base as build-app

WORKDIR /app

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
ENV NEXT_PUBLIC_STATUS_URL ${STATUS_URL}

ARG WEB_URL
ENV NEXT_PUBLIC_WEB_URL ${WEB_URL}

ARG GIT_COMMIT
ENV NEXT_PUBLIC_GIT_COMMIT ${GIT_COMMIT}

ARG SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL ${SUPABASE_URL}

ARG ANON_KEY
ENV NEXT_PUBLIC_ANON_KEY ${ANON_KEY}

ARG DEPENDENCY_DISCOVERY_URL
ENV NEXT_PUBLIC_DEPENDENCY_DISCOVERY_URL ${DEPENDENCY_DISCOVERY_URL}

COPY ./app ./

COPY --from=dependencies-app /app/node_modules ./node_modules

RUN pnpm build

## Telescope docs
FROM base as build-docs

WORKDIR /docs

COPY ./docusaurus ./

COPY --from=dependencies-docs /docs/node_modules ./node_modules

RUN pnpm build

## Deploy ######################################################################
FROM nginx:1.20.2-alpine as deploy

WORKDIR /

COPY --from=build-app /app/out /var/www/data

COPY --from=build-docs /docs/build /usr/share/nginx/html/docs

