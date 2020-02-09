# This Docker file tends to be used only
# for `development` and `test` stage
#
# CLI command to run this file: script="some-name" docker-compose up --build
# `some-name` is one of the names provided under `scripts` tag in `package.json` file
# example: $ script="test" docker-compose up --build    --> will run telescope with `test` script
# default: $ docker-compose up --build                  --> will run telescope with `start` script


# Dockerfile

# Context: Build Container
# Use `node` long term stable image as the parent to build this image
FROM node:lts-alpine as build

# Use Redis image via compose-file

# Change working directory on the image
WORKDIR "/telescope"

# Copy package.json and .npmrc from local to the image
# Copy before bundle app source to make sure package-lock.json never gets involved
COPY package.json ./
COPY .npmrc ./
# Bundle app source
COPY . .

# Install all Node.js modules on the image
RUN npm install --no-package-lock

# Build Frontend before deployment
RUN npm run build


# ADD . src/frontend/public

# User is root by default (only for development)

# Expose the server port from compose file

# Environment variable with default value
ENV script=start

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `packege.json`, passed to the image
CMD ["sh", "-c", "npm run ${script}"]
