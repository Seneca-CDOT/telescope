# Telescope API Services

## Setup

There are a number of [docker-compose](https://docs.docker.com/compose/) files available for running Telescope's services, including:

- [docker-compose.yml](docker-compose.yml) - the base docker-compose stack
  definition of our microservices, dependent services, and our api gateway, [Traefik](https://traefik.io). This is meant to be used in development only.
- [production.yml](production.yml) - overrides and extensions to the base docker-compose
  stack, with extra settings and services necessary for running in staging and production.

In conjunction with these, there are also multiple environment files, including:

- [env.development](env.development) - environment variables for local development. This
  is likely what you need to adjust or pay attention to if you're developing Telescope.
- [env.staging](env.staging) - environment variables for our staging server.
- [env.production](env.production) - environment variables for our production server.

To use these files, you first need to pick a deployment type (e.g., development, staging, or production), and copy the appropriate environment file to `src/api/.env`. For example,
Telescope developers would do:

```
$ cp env.development .env
```

Or the equivalent command to copy the file on their operating system.

## Running the Services via docker-compose

Run the services via [docker-compose](https://docs.docker.com/compose/), which will use your `.env` to decide how
to pick which docker-compose files to run:

```
cd src/api
docker-compose up --build
```

This will (re)build all the services, pull any images that are necessary for dependent services, and start all the services
together. You can then access the services via the api hostname (see `API_HOST` in your .env file). For example:

http://api.telescope.localhost/v1/image/gallery

## API Lookup Table

| API           | Docker Tag        | URL       | Description                                 |
| ------------- | ----------------- | --------- | ------------------------------------------- |
| Image Service | telescope_img_svc | /v1/image | Provides a dynamic image processing service |

## References

- [Digital Ocean: Using traefik v2 as a reverse proxy for Docker](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- [Logz: ELK stack on Docker](https://logz.io/blog/elk-stack-on-docker/)
- [Elastic: Running Elastic Search on Docker](https://www.elastic.co/guide/en/elastic-stack-get-started/master/get-started-docker.html)
