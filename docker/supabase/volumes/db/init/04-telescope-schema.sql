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
  wiki_author_name text, -- wiki owner of a feed, maybe unused when the feed is linked with an actual user
  html_url text, -- actual URL the feed refers to, could be a blog URL, a Youtube or Twitch channel
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

-- Tables policies that restrict, on request basic, which rows can be returned from a query
-- Note: servers using SERVICE_ROLE_KEY, are not restricted by RLS

ALTER TABLE telescope_profiles ENABLE ROW LEVEL SECURITY;

-- Disable all operations, unless being overwritten by other policies
CREATE POLICY profiles_policy ON telescope_profiles
    FOR ALL
    USING (false);

-- Enable read access for Seneca users
CREATE POLICY profiles_read_policy ON telescope_profiles
    FOR SELECT
    USING (((current_setting('request.jwt.claims'::text, true))::jsonb #> '{roles}'::text[]) ? 'seneca'::text);

-- Users can update their own profiles
CREATE POLICY profiles_update_policy ON telescope_profiles
    FOR UPDATE
    USING (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) = id);

ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;

-- Seneca user can update, delete, insert their own feeds
CREATE POLICY feeds_update_policy ON feeds
    FOR ALL
    USING (((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) = user_id);

-- Every one can read the feed list
CREATE POLICY feeds_read_policy ON feeds
    FOR SELECT
    USING (true);

