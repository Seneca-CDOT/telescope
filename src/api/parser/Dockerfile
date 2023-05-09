## Base ###########################################################################
# Set up the base layer
FROM node:16-alpine3.15 as base

RUN npm i -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies

COPY package.json ./

COPY ./schema.prisma .

RUN pnpm install --prod

## Deploy ########################################################################
# Stage for running our app
FROM base as deploy

WORKDIR /app

COPY --chown=node:node . .

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules

ENV PARSER_PORT=10000

USER node

# Docker Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider localhost:${PARSER_PORT}/healthcheck || exit 1

CMD ["node", "src/index.js"]
