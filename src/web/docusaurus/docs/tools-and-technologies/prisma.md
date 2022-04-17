---
sidebar_position: 11
---

# Prisma

## Our Database

[Supabase](./supabase.md) is one of the technologies that Telescope uses. Because it is built on top of Postgres, we have full access to a Postgres DB that can be used to store all sorts of data used by both frontend and backend.

> PostgreSQL is a highly stable database backed by more than 20 years of development by the open-source community.

## Database Schema

Our database schema is defined in [schema.prisma](https://github.com/Seneca-CDOT/telescope/blob/master/src/db/prisma/schema.prisma). This is where we define models and their relations using Prisma's schema syntax.

Managing the database schema using Prisma, we can track granular changes to the database schema. These granular changes are reflected as separate SQL script files. That way, our granular schema changes are reflected as code that can be captured with any version control software. This makes sure that the local development database or the production database is always up to date with the latest Schema.

## Database migration

Whenever we start up the DB container or after updating our schema, we should run a migration to apply new changes to the database if any.

## Running migration

```bash
  cd src/db
  cp env.example .env
  pnpm migrate
```

See also [DB maintenance on staging and production](../contributing/database-maintenance.md).

## Creating migration

For a migration that has a "narrowing" nature such as dropping a table, dropping a column or converting data types or similar changes, running a migration requires attention to make sure the data loss is under control. Prisma is smart enough to warn us about any potential data loss.

### Schema change

Simply edit the schema in [schema.prisma](https://github.com/Seneca-CDOT/telescope/blob/master/src/db/prisma/schema.prisma) and apply the migration.

```bash
  cd src/db
  cp env.example .env
  pnpm migrate
```

### Custom migration

Sometimes, we want to make changes other than the modifying the schema, for example, adding new RLS policies to a table. We can do so by creating an empty migration file, which is an empty SQL script where we write our own SQL queries to be applied to the database.

```bash
  cd src/db
  cp env.example .env
  pnpm create-migration
```

After creating the empty migration file, you can write SQL queries inside the newly created `migration.sql`. After writing the desired statements, you can apply the migration:

```bash
  pnpm migrate
```
