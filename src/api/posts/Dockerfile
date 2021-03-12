FROM node:lts-alpine as base

RUN apk add dumb-init

WORKDIR /app

COPY --chown=node:node . .

RUN npm install ci --only=production --no-package-lock

USER node

CMD ["dumb-init", "node", "src/server.js"]
