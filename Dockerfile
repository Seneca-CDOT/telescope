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
# These modules are needed to build mozjpeg
RUN apk add autoconf automake nasm libtool gcc make g++ tiff jpeg zlib zlib-dev pkgconf file musl-dev
# util-linux required to optimize builds using multiple cores
RUN apk add --no-cache tini util-linux
ENTRYPOINT [ "/sbin/tini", "--"]

# Set Working Directory Context
WORKDIR "/telescope"

# Copy package.jsons for each service
COPY package.json .
COPY .env .
COPY ./src/frontend/next/package.json ./src/frontend/next/package.json

# -------------------------------------
# Context: Dependencies
FROM build AS backend_dependencies

# Install Production Modules!
# Disable postinstall hook in this case since we are being explict with installs
# `postinstall` typically goes on to install front-end and autodeployment modules
# which though is logical for local development, breaks docker container caching trick.
RUN npm install --only=production --no-package-lock --ignore-scripts

FROM backend_dependencies as frontend_dependencies
RUN cd ./src/frontend/next && npm install --no-package-lock

# -------------------------------------
# Context: Front-end Builder
FROM frontend_dependencies as builder

COPY ./src/frontend/next ./src/frontend/next
COPY ./.git ./.git

RUN npm run build

# -------------------------------------
# Context: Release
FROM build AS release

# GET production code from previous containers
COPY --from=backend_dependencies /telescope/node_modules /telescope/node_modules
COPY --from=builder /telescope/src/frontend/next/out /telescope/src/next/out
COPY --from=builder /telescope/.git /telescope/.git
COPY ./src/backend ./src/backend

# Directory for log files
RUN mkdir /log

# Environment variable with default value
ENV script=start

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `package.json`, passed to the image
CMD ["sh", "-c", "npm run ${script}"]
