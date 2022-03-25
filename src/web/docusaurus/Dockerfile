## Base ########################################################################
# Set up the base layer
FROM node:16 as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

RUN npm install -g pnpm

WORKDIR /app

## Dependencies ###################################################################
# Stage for installing prod dependencies
FROM base as dependencies-dev

COPY package.json ./

RUN pnpm install

# Builder ########################################################################
# Stage for building our app
FROM base as builder

COPY --from=dependencies-dev /app/node_modules ./node_modules

COPY . .

RUN pnpm build

## Deploy ######################################################################
# Use 1.20.2-alpine nginx image
FROM nginx:1.20.2-alpine as deploy

COPY --from=builder /app/build /usr/share/nginx/html/

# Add Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1
