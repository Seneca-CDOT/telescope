# Auto Deployment

Telescope uses a separate HTTP server to listen for
[GitHub Webhook](https://developer.github.com/webhooks/) Events. The server's
configuration is stored in an `.env` file, which must be created based on
`env.example`.

On our staging (<https://dev.telescope.cdot.systems>) and production
(<https://telescope.cdot.systems>) machines listen for a `push` to the webhook, and then trigger a new build and deploy using the `deploy.sh` script.

## Routes

There are also a few other routes you can use to get information about the
auto deployment server:

- `GET /deploy/status`: returns JSON data about the current status of the build.
- `GET /deploy/log`: returns a real-time stream of current build log output, if any.

On staging you can go to:

- <https://dev.telescope.cdot.systems/deploy/status> to check the deployment status,
- <https://dev.telescope.cdot.systems/deploy/log> to check the deployment log of
  the current deployment (you can also use <https://dev.telescope.cdot.systems/deploy/log/current>),
- <https://dev.telescope.cdot.systems/deploy/log/previous> to check the deployment log of
  the previous deployment,

and on production you can use

- <https://telescope.cdot.systems/deploy/status> to check the deployment status,
- <https://telescope.cdot.systems/deploy/log> to check the deployment log of the
  current deployment (you can also use <https://telescope.cdot.systems/deploy/log/current>),
- <https://telescope.cdot.systems/deploy/log/previous> to check the deployment log of
  the previous deployment.

## Real-time build log

In the dashboard, you can check the log in real-time through the following links:

- <https://dev.api.telescope.cdot.systems/v1/status/build> for `staging`
- <https://api.telescope.cdot.systems/v1/status/build> for `production`

```sh
curl https://dev.telescope.cdot.systems/deploy/log
```
