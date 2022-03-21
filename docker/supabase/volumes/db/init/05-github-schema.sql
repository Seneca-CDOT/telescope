CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS github_users (
  id serial PRIMARY KEY,
  login citext NOT NULL, -- the user name of the user, known as the `login` field in GitHub API responses
  type citext check ( type IN ('user', 'organization') ) NOT NULL
);

CREATE TABLE IF NOT EXISTS github_repositories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  owner integer NOT NULL references github_users ON DELETE CASCADE,
  UNIQUE (owner, name) -- a user cannot have the same repository, but a repository name can be repeated for many users (e.g. forks)
);

-- In the GitHub API, pull requests are considered issues, too.
-- Therefore, we would group both pull requests and issues in a single
-- table. For more information, read:
-- https://docs.github.com/en/rest/reference/issues and
-- https://docs.github.com/en/rest/reference/pulls
CREATE TABLE IF NOT EXISTS github_issues (
  id serial PRIMARY KEY,
  number integer NOT NULL,
  repo integer NOT NULL references github_repositories ON DELETE CASCADE,
  type citext check ( type IN ('issue', 'pull_request') ) NOT NULL,
  UNIQUE (repo, number) -- an issue number is unique across the whole repo, but several repos can have the same number
);

/* 
  TODO:
    * Add policies to restrict the users who can write into these
      tables (preferably, only the search or parser microservice
      should write).
    * Add bridge tables that connect this GitHub information to
      a posts table that contains the posts themselves.
 */
