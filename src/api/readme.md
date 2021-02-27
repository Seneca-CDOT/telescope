# Telescope API Services

## Setup

There are a number of [docker-compose](https://docs.docker.com/compose/) files available for running Telescope's services, including:

- [docker-compose.yml](docker-compose.yml) - the base docker-compose stack
  definition of our microservices and our api gateway, [Traefik](https://traefik.io).
- [development.yml](development.yml) - dependent services needed for development, testing, and CI. This is meant to be used in development only.
- [production.yml](production.yml) - overrides and extensions to the base docker-compose
  stack, with extra settings and services necessary for running in staging and production.

In conjunction with these, there are also multiple environment files, including:

- [env.development](env.development) - environment variables for local development.
- [env.staging](env.staging) - environment variables for our staging server.
- [env.production](env.production) - environment variables for our production server.

## Running the Services via docker-compose

Run the services from the root directory:

```
npm run services:start
```

This will (re)build all the services, pull any images that are necessary for dependent services, and start all the services
together. You can then access the services via the api hostname (see `API_HOST` in your .env file). For example:

http://api.telescope.localhost/v1/image/gallery

You can access logs for one or more services:

```
npm run services:logs image firebase
```

To stop the services:

```
npm run services:stop
```

## API Lookup Table

| API   | Docker Tag         | URL       | Description                                       |
| ----- | ------------------ | --------- | ------------------------------------------------- |
| image | telescope_img_svc  | /v1/image | Provides a dynamic image processing service       |
| auth  | telescope_auth_svc | /v1/auth  | Provides authentication and authorization service |

## Support Services Lookup Table (development only)

| API                | URL                                 | Description                       |
| ------------------ | ----------------------------------- | --------------------------------- |
| Firebase UI        | http://ui.firebase.localhost        | UI Dashboard to Firebase Emulator |
| Firebase Firestore | http://firestore.firebase.localhost | Firestore Emulator Service        |
| Login              | http://login.localhost              | SAML SSO Identity Provider        |

## References

- [Digital Ocean: Using traefik v2 as a reverse proxy for Docker](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- [Logz: ELK stack on Docker](https://logz.io/blog/elk-stack-on-docker/)
- [Elastic: Running Elastic Search on Docker](https://www.elastic.co/guide/en/elastic-stack-get-started/master/get-started-docker.html)
