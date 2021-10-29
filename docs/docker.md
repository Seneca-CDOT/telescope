# Docker and Telescope

## Introduction

Telescope uses Docker to deploy all the different parts of our app. If you haven't
worked with Docker before, it's worth taking a few minutes to [learn how it works](https://docs.docker.com/get-started/).

You'll see Docker used in a few places

## Setup

See the [environment setup doc](environment-setup.md) for info specific to your platform.

Once installed, Docker uses the following commands:

- [`docker`](https://docs.docker.com/engine/reference/commandline/cli/)
- [`docker-compose`](https://docs.docker.com/compose/reference/)

## Running Telescope via Docker

We have a number of docker-compose files that control all the apps that we ship:

- `docker-compose.yml` - the development version of our "classic" Telescope app (front-end and back-end)
- `docker-compose-production.yml` - the production version of our "classic" Telescope app (front-end and back-end)

We also have files for our new Microservices Back-end:

- `./src/api/docker-compose-api.yml` - the development version
- `./src/api/docker-compose-api-production.yml` - the production version

The docker-compose files define a set of separate servers and services that can
be run together with a single command.

```
# run our development version of the entire Telescope app, building any containers as necessary
docker-compose -f docker-compose.yml up --build

# stop the running containers
docker-compose -f docker-compose.yml down
```

If you want to run a specific app or apps, you can name them:

```
# run our development version of the entire Telescope app, building any containers as necessary
docker-compose -f docker-compose.yml up --build login redis telescope
```

### Running the Microservices

See the [docs for running the services](environment-setup.md).
