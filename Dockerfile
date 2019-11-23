# This Docker file tends to be used only
# for `development` and `test` stage
#
# CLI command to run this file: script="some-name" docker-compose up --build
# `some-name` is one of the names provided under `scripts` tag in `package.json` file
# example: $ script="test" docker-compose up --build
# default: $ docker-compose up --build      --> will run telescope with debug-server script


# Dockerfile

# To guarantee the same stack for each image build:
# - Specify Ubuntu as the parent image
# - Install Node.js to let using npm in this stage of the build
# - Use Redis image via compose-file
# comment: The Ubuntu and Node.js versions need to be selected carefully (important: https://github.com/nodesource/distributions),
#   and can not be passed as .env variables or arguments.

# UBUNTU VERSION:
#   Using a stable version with standard support up to April 2023
#   https://wiki.ubuntu.com/Releases, https://hub.docker.com/_/ubuntu/
ARG UBUNTU_VERSION=18.04

# NODE VERSION:
#   Using an stable version rather than the latest
#   Node version 12, https://nodejs.org/en/about/releases/, https://hub.docker.com/_/node/
#   End of life for this version: 2022-04-30 subject to change
ARG NODE_VERSION=12


# Specify parent image to build this image
FROM ubuntu:$UBUNTU_VERSION

# Update OS
# Install Linux `apt-utils` package to enhance packages configuration
# Install Linux `bc` package to support interactive execution of statements
# Install Linux `inotify-tools` to support nodemon file change tracking
# Install Linux `curl` package to support transfer data from URL
RUN apt-get update -y
RUN apt-get install -y apt-utils
RUN apt-get install -y bc
RUN apt-get install -y inotify-tools
RUN apt-get install -y curl
RUN echo "Finished installing OS dependencies"

# Install Node.js from https://github.com/nodesource/distributions
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN echo "Installed Node.js Version 12"

# Set Shell to exit immediately if a pipeline returns a non-zero status: -e
# Set Shell to print shell input lines as they are read: -v
# Set Shell to print a trace of commands: -x
RUN set -evx

# Change working directory on the image
WORKDIR "/telescope"

# Copy package.json and .npmrc from local to the image
# Copy before bundle app source to make sure package-lock.json never gets involved
COPY package.json ./
COPY .npmrc ./

# Install all Node.js modules on the image
RUN npm install --no-package-lock

# Reinstall `nodemon` to set the legacy watch flag
RUN npm uninstall nodemon
RUN npm install -g nodemon --legacy-watch

# Bundle app source
COPY . .

# Expose the server port from compose file

# Set the user name and group as the root user
USER root:root

# Accept argument to start running the image; has a default value
ENV script=debug-server

# Running telescope when the image gets built using a script
# `script` is one of the scripts from `packege.json`, passed to the image as an argument
CMD ["sh", "-c", "npm run ${script}"]
