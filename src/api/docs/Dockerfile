# Creates a layer from node:lts-alpine as the base image
FROM node:lts-alpine as base

# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
RUN apk add dumb-init

# Sets the working directory for any COPY, RUN, CMD commands
WORKDIR /app

# Copy new files or directory into the file system of the container
COPY --chown=node:node . .

# Execute 'npm install...' command only in production. Don't generate package-lock
RUN npm install --only=production --no-package-lock

RUN npm run build

CMD ["npm", "run", "dev"]
