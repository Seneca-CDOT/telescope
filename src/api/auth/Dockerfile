FROM node:lts-alpine as base
RUN apk add dumb-init
WORKDIR /app
COPY --chown=node:node ./package.json ./package-lock.json ./

FROM base AS dependencies
RUN npm install ci --only=production

FROM dependencies as deploy
COPY --chown=node:node ./src ./src
USER node
CMD ["dumb-init", "node", "src/server.js"]
