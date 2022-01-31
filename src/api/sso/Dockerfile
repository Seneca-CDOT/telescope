## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, pytyhon)
FROM node:lts as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the package.json and lock file over
COPY package*.json /home/node/app/

## Development #################################################################
# Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/app
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN npm install
# Copy the source code over
COPY --chown=node:node . /home/node/app/
# Switch to the node user vs. root
USER node
# Start the app in debug mode so we can attach the debugger
CMD ["npm", "run", "dev"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/app
# We'll install production only deps, and target the Linux Musl x64 for alpine.
RUN npm install --platform=linuxmusl --arch=x64 --production

## Deploy ######################################################################
# Use a smaller node image (-alpine) at runtime
FROM node:lts-alpine as deploy
# Install dumb-init, see:
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
# Install specific version, and don't cache https://github.com/hadolint/hadolint/wiki/DL3018
# https://pkgs.alpinelinux.org/package/edge/community/x86/dumb-init
RUN apk --no-cache add dumb-init=1.2.5-r1
WORKDIR /home/node/app
# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/app/node_modules /home/node/app/node_modules/
# Copy the source code
COPY --chown=node:node . /home/node/app/
# Switch to the node user vs. root
USER node
# Start the app
CMD ["dumb-init", "node", "src/server.js"]