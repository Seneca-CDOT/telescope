---
sidebar_position: 8
---

# Database Maintenance

The following describes how to manually work with the Postgres database.

## Backup (Manual)

1. Go to Portainer ([staging][portainer-staging] or [production][portainer-production]) and locate the `pg-backup-cron-job` container
2. Click the **Console** button and select `bin/sh` in order to get a shell in the container
3. Run a backup:

```sh
/etc/periodic/daily/create-backup
```

This will create a new dump file in `/var/opt/pg_dumps` with the current date and time.

## Restore a Backup

1. Go to Portainer ([staging][portainer-staging] or [production][portainer-production]) and locate the `pg-backup-cron-job` container
1. Click the **Console** button and select `bin/sh` in order to get a shell in the container
1. Run a restore:

```sh
ls /var/opt/pg_dumps
# Locate your desired dump file <absolute-path-to-dump-file>
$ ./restore-backup <absolute-path-to-dump-file>
```

This will attempt to restore the database to the state in the dump file.

:::note

Some operations will fail if tables exist or if the schema in the dump file does not match with the schema in the database, or if Postgres can't make it work for some reason.

:::

## Migrations

1. Go to Portainer ([staging][portainer-staging] or [production][portainer-production])
2. Click on the `primary` environment, which has all of our containers.
3. Click **Containers**
4. Get the current postgres password going to the `supabase-db` container, and inspecting the `POSTGRES_PASSWORD` environment variable. Copy this (you will need it below).
5. Go back to **Containers** and click **Add Container** to add a new container
6. Enter a **Name**: `db-migrations`
7. Select the `docker.cdot.systems` **Registry**. If you don't see it, add it via the **Registries** navigation menu on the left.
8. Enter **Image Name**: `db-migrations:staging`
9. Under **Advanced Container Settings**, click the **Network** tab, and change the **Network** from `bridge` to use current default network (e.g., `blue_default` or `green_default`).
10. Under **Advanced Container Settings**, click the **Env** tab, and add an environment variable, `DATABASE_URL` with a value of `postgres://postgres:<$POSTGRES_PASSWORD>@db:5432/postgres`, where `<$POSTGRES_PASSWORD>` is the current postgres password for the `db` container.
11. Click the **Deploy the container** button
12. Look at the **Logs** for the `db-migrations` container that you just created, and make sure it ran correctly.
13. Go to the Supabase Console ([staging][supabase-staging] or [production][supabase-production])
14. Once you are happy with what it has done, you can **Remove** the `db-migrations` container.

[portainer-staging]: https://dev.portainer.telescope.cdot.systems
[portainer-production]: https://portainer.telescope.cdot.systems
[supabase-staging]: https://dev.supabase.telescope.cdot.systems
[supabase-production]: https://supabase.telescope.cdot.systems
