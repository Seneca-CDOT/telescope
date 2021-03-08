FROM node:lts-alpine as base

# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
RUN apk add dumb-init

WORKDIR /app

COPY --chown=node:node . .

RUN npm install ci --only=production

USER node

CMD ["dumb-init", "node", "src/server.js"]
