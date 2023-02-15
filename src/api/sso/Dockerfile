## Base ###########################################################################
# Set up the base layer
# Use a larger node image to do the build for native deps (e.g., gcc, pytyhon)
FROM docker.cdot.systems/library/node:16 as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

RUN npm i -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies

COPY package.json ./

RUN pnpm install --prod

## Deploy ######################################################################
# Stage for that run our app
# Use a smaller node image (-alpine) at runtime
FROM docker.cdot.systems/library/node:16-alpine3.15 as deploy

WORKDIR /app

# Copy prodduction node_modules from dependencies
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules/

# Copy the source code
COPY --chown=node:node . .

# Switch to the node user vs. root
USER node

ENV SSO_PORT=7777

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider localhost:${SSO_PORT}/healthcheck || exit 1

# Start the app
CMD ["node", "src/server.js"]
