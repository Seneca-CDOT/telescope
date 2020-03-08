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

# Tini Entrypoint for Alpine
RUN apk add --no-cache tini
ENTRYPOINT [ "/sbin/tini", "--"]

# Set Working Directory Context
WORKDIR "/telescope"

# Copy shared context
COPY package.json .

# -------------------------------------
# Context: Dependencies
FROM build AS dependencies

# Get Entire Codebase
COPY . .
# Copy certs into container
COPY ./certs ./certs

# Install Production Modules, Build!
RUN npm install --only=production --no-package-lock
RUN npm run build


# -------------------------------------
# Context: Release
FROM build AS release

# GET deployment code from previous containers
COPY --from=dependencies /telescope/node_modules /telescope/node_modules
COPY --from=dependencies /telescope/src/frontend/public /telescope/src/frontend/public
COPY ./src/backend ./src/backend
# Copy certs into container
COPY ./certs ./certs

# Environment variable with default value
ENV script=start

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `package.json`, passed to the image
CMD ["sh", "-c", "npm run ${script}"]
