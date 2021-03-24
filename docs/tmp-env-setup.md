With the new microservices shipping, the old [environment-setup](environment-setup) document might not work. In the transition, this document may be helpful for developers. Here are some instructions for different scenarios, they are based on [next.config.js](../src/web/next.config.js) code logic. This `next.config.js` file configures which `env` file to use. It reads `.env` in the root first, if there is no `.env` in the root, it reads [env.development](../config/env.development).

- Only want to work on front-end, don't need anything from back-end.

  ```
  # 1. copy config/env.staging to .env.
  # If you have old .env, it is good to delete it before copy to prevent overwrite error
  cp config/env.staging .env
  # 2. start services
  npm run services:start
  # 3. run front-end application
  npm run dev
  ```

- Want to run back-end services locally, and to have front-end using the services.

  This is the default setting, you **don't need to copy or modify** any env file. Just run `npm run services:start` and `npm run dev`. However, if it doesn't work and you have old `.env` that was copied from old `.env.example`, delete it.

- Want to mix and match services between local and staging.

  This one depends on which part you're working on. For example, if you want to work with authorization, you need to specify the URL of AUTH in `.env`, which is, go to `.env` and find `AUTH_URL=...`. If you're testing auth locally, use `AUTH_URL=http://localhost/v1/auth`; otherwise, use staging, `AUTH_URL=http://dev.api.telescope.cdot.systems/v1/auth`

  Then, do `npm run services:start`, and `npm run dev`.
