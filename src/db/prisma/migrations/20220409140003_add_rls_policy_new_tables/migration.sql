-- Add Read level access to all users, and restrict all other access for the quotes, and github tables

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY quotes_policy ON quotes
    FOR ALL
    USING (false);

CREATE POLICY quotes_read_policy ON quotes
    FOR SELECT
    USING (true);

ALTER TABLE github_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY github_issues_policy ON github_issues
    FOR ALL
    USING (false);

CREATE POLICY github_issues_read_policy ON github_issues
    FOR SELECT
    USING (true);

ALTER TABLE github_repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY github_repositories_policy ON github_repositories
    FOR ALL
    USING (false);

CREATE POLICY github_repositories_read_policy ON github_repositories
    FOR SELECT
    USING (true);

ALTER TABLE github_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY github_users_policy ON github_users
    FOR ALL
    USING (false);

CREATE POLICY github_users_read_policy ON github_users
    FOR SELECT
    USING (true);
