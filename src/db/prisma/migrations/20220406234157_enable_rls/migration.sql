
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

