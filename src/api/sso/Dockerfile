FROM node:lts-alpine as base
RUN apk add dumb-init
WORKDIR /app
COPY --chown=node:node ./package.json ./

FROM base AS dependencies
RUN npm install --only=production --no-package-lock

FROM dependencies as deploy
COPY --chown=node:node ./src ./src
USER node
CMD ["dumb-init", "node", "src/server.js"]
