# This Docker file is used  for
# `development`, `test`, and `staging` enviornments
#
# CLI command to run this file: script="some-name" docker-compose up --build
# `some-name` is one of the names provided under `scripts` tag in `package.json` file
# example: $ script="test" docker-compose up --build    --> will run telescope with `test` script
# default: $ docker-compose up --build                  --> will run telescope with `start` script


# Dockerfile
#
# -------------------------------------
# Context: Build Context
FROM node:lts-alpine as build

<<<<<<< HEAD
# Tini Entrypoint for Alpine
RUN apk add --no-cache tini
ENTRYPOINT [ "/sbin/tini", "--"]
=======
# Use `node` long term stable image as the parent to build this image
FROM node:lts
EXPOSE 8080
# Use Redis image via compose-file
>>>>>>> f950c9b... further changes

# Set Working Directory Context
WORKDIR "/telescope"

# Copy package.jsons for each service
COPY package.json .
COPY ./tools/autodeployment/package.json ./tools/autodeployment/package.json
COPY ./src/frontend/package.json ./src/frontend/package.json

# -------------------------------------
# Context: Dependencies
FROM build AS dependencies

# Install Production Modules! 
# Disable postinstall hook in this case since we are being explict with installs
# `postinstall` typically goes on to install front-end and autodeployment modules
# which though is logical for local development, breaks docker container caching trick.
RUN npm install --only=production --no-package-lock --ignore-scripts

# Install Frontend Modules!
RUN cd ./src/frontend && npm install --no-package-lock

# Install Deployment Microservice Modules!
RUN cd /telescope/tools/autodeployment && npm install --no-package-lock --ignore-scripts


# -------------------------------------
# Context: Front-end Builder
FROM dependencies as builder

COPY ./src/frontend ./src/frontend
COPY ./.git ./.git
COPY ./.env ./.env

RUN npm run build

# -------------------------------------
# Context: Release
FROM build AS release

# GET deployment code from previous containers
COPY --from=dependencies /telescope/node_modules /telescope/node_modules
COPY --from=dependencies /telescope/tools/autodeployment /telescope/tools/autodeployment
COPY --from=builder /telescope/src/frontend/public /telescope/src/frontend/public
COPY --from=builder /telescope/.git /telescope/.git
COPY ./src/backend ./src/backend

# Environment variable with default value
ENV script=start

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `package.json`, passed to the image
CMD ["sh", "-c", "npm run ${script}"]

