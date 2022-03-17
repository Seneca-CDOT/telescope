## Base ###########################################################################
# Set up the base layer
FROM node:16-alpine3.15 as base

RUN npm i -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies

COPY package.json ./

RUN pnpm install --prod

## Dependencies-dev ###############################################################
# Stage for installing dev dependencies
FROM base as dependencies-dev

COPY package.json ./

RUN pnpm install

## Builder ########################################################################
# Stage for building our app
FROM base as builder

COPY --from=dependencies-dev /app/node_modules ./node_modules

COPY . .

RUN pnpm build

## Deploy ########################################################################
# Stage for that run our app
FROM base as deploy

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

COPY --chown=node:node --from=builder /app/public ./public

COPY --chown=node:node --from=builder /app/scss ./scss

COPY --chown=node:node --from=builder /app/src ./src

ENV PORT=1111

USER node

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider localhost:${PORT}/healthcheck || exit 1

CMD ["node", "src/server.js"]
