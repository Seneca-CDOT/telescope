# Telescope API Services

## Setup

There are a number of [docker-compose](https://docs.docker.com/compose/) files available for running Telescope's services, including:

- [docker/docker-compose.yml](docker/docker-compose.yml) - the base docker-compose stack
  definition of our microservices, dependent services, and our api gateway, [Traefik](https://traefik.io). This is meant to be used in development only.
- [docker/development.yml](docker/development.yml) - overrides and extensions to the base docker-compose
  stack, with extra settings and services necessary for running in development or CI.
- [docker/production.yml](docker/production.yml) - overrides and extensions to the base docker-compose
  stack, with extra settings and services necessary for running in staging and production.

In conjunction with these, there are also multiple environment files, including:

- [config/env.development](config/env.development) - environment variables for local development. This
  is likely what you need to adjust or pay attention to if you're developing Telescope.
- [config/env.staging](config/env.staging) - environment variables for our staging server.
- [config/env.production](config/env.production) - environment variables for our production server.

The env files are configured to specify which variables and docker-compose files are needed to be run.
For most developers, doing the following will work:

```
docker-compose --env-file config/env.development up -d
```

## Running the Services via docker-compose

You can access logs for one or more services:

```
npm run services:logs image firebase
```

To stop the services:

```
npm run services:stop
```

## API Lookup Table

| API    | Docker Tag           | URL                          | Description                                       |
| ------ | -------------------- | ---------------------------- | ------------------------------------------------- |
| posts  | telescope_posts_svc  | <http://localhost/v1/posts>  | Provides access to cached user posts              |
| image  | telescope_img_svc    | <http://localhost/v1/image>  | Provides a dynamic image processing service       |
| auth   | telescope_auth_svc   | <http://localhost/v1/auth>   | Provides authentication and authorization service |
| users  | telescope_users_svc  | <http://localhost/v1/users>  | Provides telescope's user services                |
| parser | telescope_parser_svc | <http://localhost/v1/parser> | Provides telescope's parser services              |
| search | telescope_search_svc | http://localhost/v1/search   | Provides an ELK query controller service          |

## Support Services Lookup Table (development only)

| API                | URL                                | Description                                                               |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------- |
| Traefik Dashboard  | <http://localhost:8080>            | [Traefik Dashboard](https://doc.traefik.io/traefik/operations/dashboard/) |
| Redis              | redis://localhost:6379             | Redis server                                                              |
| Elasticsearch      | <http://localhost:9200>            | Elasticserach                                                             |
| Firebase UI        | <http://localhost:4000>            | UI Dashboard to Firebase Emulator                                         |
| Firebase Firestore | <http://localhost:8088>            | Firestore Emulator Service                                                |
| Login              | <http://localhost:8081/simplesaml> | SAML SSO Identity Provider                                                |

## References

- [Digital Ocean: Using traefik v2 as a reverse proxy for Docker](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- [Logz: ELK stack on Docker](https://logz.io/blog/elk-stack-on-docker/)
- [Elastic: Running Elastic Search on Docker](https://www.elastic.co/guide/en/elastic-stack-get-started/master/get-started-docker.html)
