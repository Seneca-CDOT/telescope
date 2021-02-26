FROM node:lts:alphine as base

RUN apk add dumb-init

WORKDIR /app

COPY --chown=node:node . .

RUN npm install ci --only=production

USER node

CMD ["dumb-init", "node", "server.js"]
