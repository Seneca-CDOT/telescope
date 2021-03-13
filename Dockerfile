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

# NEXT_PUBLIC_API_URL is needed by the next.js build, which we define
# as a build ARG in API_URL
ARG API_URL
# API Service URLs, set via ENV in docker or next build
ARG IMAGE_URL

# Context: Build Context
FROM node:lts-alpine as build

# Tini Entrypoint for Alpine
# util-linux required to optimize builds using multiple cores
RUN apk add --no-cache tini util-linux
ENTRYPOINT [ "/sbin/tini", "--"]

# Set Working Directory Context
WORKDIR "/telescope"

# Copy package.jsons for each service
COPY package.json .
COPY ./src/web/package.json ./src/web/package.json

# -------------------------------------
# Context: Dependencies
FROM build AS backend_dependencies

# Forward the API_URL and Service URLs build ARGs from pervious stage
ARG API_URL
ARG IMAGE_URL

# Install Production Modules!
# Disable postinstall hook in this case since we are being explict with installs
# `postinstall` typically goes on to install front-end and autodeployment modules
# which though is logical for local development, breaks docker container caching trick.
RUN npm install --only=production --no-package-lock --ignore-scripts

FROM backend_dependencies as frontend_dependencies
RUN cd ./src/web && npm install --no-package-lock

# -------------------------------------
# Context: Front-end Builder
FROM frontend_dependencies as builder

# Copy the various API URLs build args over so next.js can see them in next.config.js
ARG API_URL
ENV NEXT_PUBLIC_API_URL ${API_URL}

ARG IMAGE_URL
ENV NEXT_PUBLIC_IMAGE_URL ${IMAGE_URL}

COPY ./src/web ./src/web
COPY ./.git ./.git

RUN npm run build

# -------------------------------------
# Context: Release
FROM build AS release

# GET production code from previous containers
COPY --from=backend_dependencies /telescope/node_modules /telescope/node_modules
COPY --from=builder /telescope/src/web/out /telescope/src/web/out
COPY --from=builder /telescope/.git /telescope/.git
COPY ./src/backend ./src/backend

# Directory for log files
RUN mkdir /log

# Environment variable with default value
ENV script=start

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `package.json`, passed to the image
CMD ["sh", "-c", "npm run ${script}"]
