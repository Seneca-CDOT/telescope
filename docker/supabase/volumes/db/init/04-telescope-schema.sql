-- Case-insensitive text type
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;

-- Registered Telescope users
CREATE TABLE IF NOT EXISTS telescope_profiles (
  id text PRIMARY KEY,
  registered_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  display_name citext UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email citext UNIQUE NOT NULL,
  github_username citext UNIQUE NOT NULL,
  github_avatar_url text NOT NULL
);

-- Planet CDOT Feed List, see https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List
CREATE TABLE IF NOT EXISTS feeds (
  url text PRIMARY KEY,
  user_id text references telescope_profiles ON DELETE CASCADE, -- optional, a user can claim an existing feed when they register
  author_name text, -- owner of a feed, maybe unused when the feed is linked with an actual user
  htm_url text, -- actual URL the feed refers to, could be a blog URL, a Youtube or Twitch channel
  type text DEFAULT 'blog' check ( type IN ('blog', 'youtube', 'twitch') ),
  invalid boolean DEFAULT false,
  flagged boolean DEFAULT false
);

-- Trigger for auto-updating update_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger on telescope_profiles
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON telescope_profiles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
