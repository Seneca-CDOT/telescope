FROM node:lts-alpine as base

# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
RUN apk add dumb-init

# TODO: Add feeding in the port from a .env file

# Force production env, regardless of what we get from .env
ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node . .

RUN npm install ci --only=production

USER node

CMD ["dumb-init", "node", "server.js"]
