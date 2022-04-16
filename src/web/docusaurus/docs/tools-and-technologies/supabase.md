---
sidebar_position: 10
---

# Supabase

## What is [Supabase](https://supabase.com/docs/)

[Supabase](https://supabase.com/docs/) is an application development software that includes many backend services:

- Database: A dedicated scalable Postgres database
- Studio: A web dashboard that includes Table & SQL editors, Database management, API documentation.
- Rest API: Auto generated API for your database
- Realtime: Realtime subscription to database changes
- Authorization: User management with Role Revel Security

## Architecture

![Supabase Architecture](../../static/img/supabase-architecture.png)

## Self hosting

Unlike the [hosted platform](https://app.supabase.io/), Telescope self-hosts and manages the infrastructure where the containerized Supabase runs.

Supabase consists of many containerized images defined in [docker/supabase](https://github.com/Seneca-CDOT/telescope/tree/master/docker/supabase)

### Configration

There are 4 important keys that help us securing our database.

- `POSTGRES_PASSWORD`: POSTGRES database password
- `ANON_KEY`: A public API key, used for interacting with the database through REST interface but restricted by RLS
- `SERVICE_ROLE_KEY`: A private admin key used only the server and is not restricted by RLS
- `JWT_SECRET`: JWT secret used for verifying the signature of backend-issued JWT token

### Interacting with the database through a restful interface

We can interact with our API directly via HTTP requests, or through the Supabase client libraries.

#### Via HTTPS

```bash
curl http://localhost/v1/supabase/rest/v1/feeds?select=*&limit=2
   -H "apiKey:<ANON_KEY>"
   -H "Content-Type: application/json"
```

#### Via client libraries

```js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const { data: feeds, error } = await supabase.from('feeds').select('*').limit(2);
```

## Supabase Studio

Supabase studio in a web dashboard for managing your Supabase project with Table & SQL editor and API documentation.

The Studio uses the [SERVICE_ROLE_KEY](#configration) for managing the database and is not restricted by RLS. To secure the studio deployment, it is put behind an OAuth proxy that grants access to Telescope contributors only.

If you are not able to log in to the Studio, contact [@humphd](https://github.com/humphd) so he can add you to the list.

Studio on [Development](http://localhost:8910), [Staging](https://dev.supabase.telescope.cdot.systems/), [Production](https://supabase.telescope.cdot.systems/)

![Supabase-studio](../../static/img/supabase-studio.png)
