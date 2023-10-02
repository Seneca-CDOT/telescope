## Base ###########################################################################
# Set up the base layer
FROM node:18 as base

RUN npm i -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies

COPY package.json ./

RUN pnpm install --prod

## Deploy ########################################################################
# Stage for running our app
FROM node:18-alpine3.15 as deploy

WORKDIR /app

COPY --chown=node:node . .

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

ENV DEPENDENCY_DISCOVERY_PORT=10500

USER node

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider localhost:${DEPENDENCY_DISCOVERY_PORT}/healthcheck || exit 1

CMD ["node", "src/server.js"]
