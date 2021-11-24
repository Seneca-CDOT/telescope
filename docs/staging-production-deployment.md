# Staging / Production Deployment

The steps to launch Telescope in staging or production mode are almost identical. The only difference between the 2 deployment types is that some of the variables in the `.env` files need to be manually set with the values `staging` or `production`

## Prerequisites

- [Docker and Docker-compose](https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md#docker-and-docker-compose-set-up)
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [pm2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) (optional)

## Directory Structure

The project needs to be set up using a specific directory structure to make sure that Telescope has access to the SSL certificates, redis data and elasticsearch data, and to prevent the certificates and the stored data from being deleted during a redeployment.

```sh
├── parent-directory
│   ├── autodeployment
│   ├── certbot
│   ├── elastic-data
│   ├── redis-data
│   └── telescope
```

## Steps

### 1.- Redis and Elasticsearch Directories

`redis-data` and `elastic-data` are the directories used by the Redis and Elasticsearch containers to store the processed data. Redis will automatically create (or use) the `redis-data` directory at deployment, but the `elastic-data` directory needs to be manually created (only for the first deployment) and must have specific ownership settings . The steps to create the `elastic-data` directory and set up the necessary ownership are:

```sh
- mkdir elastic-data
- sudo chown -R 1000:1000 elastic-data
```

More info about the ownership issue [here](https://discuss.elastic.co/t/elastic-elasticsearch-docker-not-assigning-permissions-to-data-directory-on-run/65812/2).

### 2.- SSL and Let's Encrypt

Telescope and its autodeployment server use SSL certificates in order to have encrypted and secure communication with web browsers and GitHub.<br>
There are many organizations and companies that offer SSL certificates. One of those organizations is the [Interet Security Research Group (ISRG)](https://www.abetterinternet.org/about/), which provides a service called [Let's Encrypt](https://letsencrypt.org/about/), a free, automated, and open certificate authority (CA) that issues digital certificates.<br><br>
The process of obtaining, installing and using digital certificates is often complex and requires installing tools and getting familiar with them.<br>
To make this process simpler, here is a [guide](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71) and a [GitHub repository](https://github.com/wmnnd/nginx-certbot) to automate all the necessary steps using docker-compose, and get SSL certificates issued by Let's Encrypt.

After following the steps in the guide, make sure the generated directory (probably called `certbot`) is owned by the user that is going to deploy Telescope and the autodeployment server. To set the correct user as owner of the generated directory:

```sh
sudo chown -R <user_name>: certbot
```

### 3.- Autodeployment server

Telescope uses [GitHub webhooks](https://docs.github.com/en/developers/webhooks-and-events/about-webhooks) to automate deployments whenever a pull requests is merged or a new version is released.
When a GitHub event is triggered, it sends a POST request payload to the webhook's configured URL. Telescope's autodeployment server receives that POST request and updates Telescope with the latest merged changes or with a new release.

After [creating a GitHub webhook](https://docs.github.com/en/developers/webhooks-and-events/creating-webhooks), copy the `autodeployment` directory in `tools` in the repository to the chosen directory where the project lives, as indicated above.<br>
Copy `env.example` in the `autodeployment` directory to `.env` and add the appropriate values for the variables in it:

- env variables
  - path to certs (usually `../certbot/live/your.domain`)
  - secret (The same secret used with GitHub's webhook)
  - port (The the same port setup in GitHub's webhook. Recommended 4000)
  - repo name (Telescope)
  - deployment type (`staging` or `production`)
  - unsplash client id

Install the dependencies using `pnpm install`, and run the server with `pnpm start`.

**Note**: Telescope relies on docker to restart after 5AM unexpected reboots or the like. The autodeployment server runs outside of docker so it needs another tool like [pm2](https://pm2.keymetrics.io/) or a [unit file](https://fedoramagazine.org/systemd-getting-a-grip-on-units/) to be able to restart after an unexpected reboot.

More info about the deployment server [here](https://github.com/Seneca-CDOT/telescope/tree/master/tools/autodeployment).

### 4.- Telescope

To launch telescope:

- Copy the Telescope directory where the project is going to live
- Inside `Telescope`, copy `env.staging` or `env.production` to `.env`
- Make sure `UNSPSLAH_CLIENT_ID` var in `.env` has a valid value
- Run docker-compose to launch telescope using the production docker-compose file:

  ```sh
  docker-compose -f docker-compose-production.yml up -d
  ```
