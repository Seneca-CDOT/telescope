## Base ###########################################################################
# Set up the base layer
FROM docker.cdot.systems/library/node:16 as base

RUN npm i -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies

COPY package.json ./

# On M1 Macs, we need to force Sharp to use the correct binaries for
# our container OS and architecture, see https://sharp.pixelplumbing.com/install#cross-platform.
# However, pnpm doesn't support passing --platform=... to `install`
# so we need to set this via an environment variable, so it isn't
# inferred from the host.
RUN npm_config_platform=linuxmusl pnpm install --prod --ignore-scripts=false

## Deploy ########################################################################
# Stage for running our app
FROM docker.cdot.systems/library/node:16-alpine3.15 as deploy

WORKDIR /app

COPY --chown=node:node . .

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

ENV IMAGE_PORT=4444

USER node

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider localhost:${IMAGE_PORT}/healthcheck || exit 1

CMD ["node", "src/server.js"]
