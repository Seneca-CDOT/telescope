# Auto Deployment

Telescope uses a separate HTTP server to listen for
[GitHub Webhook](https://developer.github.com/webhooks/)Events. The server's
configuration is stored in an `.env` file, which must be created based on
`env.example`.

On our staging (https://dev.telescope.cdot.systems) and production
(https://telescope.cdot.systems) machines we use these webhooks to trigger a new
build and deploy. For staging, this happens on every push to the `master`
branch. On production, we listen for GitHub releases (e.g., when a new release
is created on GitHub).

There are also a few other routes you can use to get information about the
auto deployment server:

- `GET /deploy/status`: returns JSON data about the current status of the build.
- `GET /deploy/log`: returns a real-time stream of current build log output, if any.

On staging you can go to:

- https://dev.telescope.cdot.systems/deploy/status to check the deployment status,
- https://dev.telescope.cdot.systems/deploy/log to check the deployment log,

and on production you can use

- https://telescope.cdot.systems/deploy/status to check the deployment status,
- https://telescope.cdot.systems/deploy/log to check the deployment log.

```
$ curl https://dev.telescope.cdot.systems/deploy/log
```
