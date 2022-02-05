CREATE extension IF NOT EXISTS citext WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS telescope_profiles (
  id text PRIMARY KEY,
  registered_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  display_name citext UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email citext UNIQUE NOT NULL,
  github_username citext UNIQUE NOT NULL,
  github_avatar_url text NOT NULL
);

CREATE TABLE IF NOT EXISTS feeds (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id text NOT NULL references telescope_profiles ON DELETE CASCADE,
  feed_url text UNIQUE NOT NULL,
  type text DEFAULT 'blog'
);
