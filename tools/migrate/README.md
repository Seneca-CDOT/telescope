# Planet CDOT Feed List migration tool

This tool downloads all users from the wiki page and inserts them into supabase db or dumps them into a JSON file

## Writing the feed list to JSON

In `to_json.js` you can find the following two variables: `FEED_URL` and `FILE_NAME`.

- `FEED_URL` points to the current location of the [Planet CDOT Feed List](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List#Feeds)
- `FILE_NAME` allows users to specify the desired filename of the output file

## Migrating to Supabase

Migrating to Supabase requires creating a `supabase` client with admin rights.

`to_supabase.js` gets `SUPABASE_URL` and `SERVICE_ROLE_KEY` of the current supabase setup from environment variables.

To start, copy the example env var from `env.example`:

```bash
# on Linux/macOS
cp env.example .env
# on Windows
copy env.example .env
```

## Install dependencies

```bash
cd src/tools/migrate
pnpm install
```

## Usage

```bash
cd src/tools/migrate
# To JSON
pnpm to_json
# To Supabase
pnpm to_supabase
```
