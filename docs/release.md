# Release

As Telescope matures, we are trying to improve our build, release, and deployment
processes and tools. This is an on-going effort, and all maintainers should
try to keep this document up-to-date to reflect our current practices.

## Setup

In order for the automated release process to work, you must do the following:

- create an `upstream` remote for Telescope to which you can push
- create a [personal access token on GitHub](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) for the SenecaCDOT/telescope repo. You only need to grant "repo" access, not "admin" or other scopes. _NOTE: keep this private, don't add to git_
- add your access token to your `.env` file using the `GITHUB_TOKEN` variable

## Create a Release

When we release Telescope, we need to do a number of things:

- run our linters, tests, and make sure the code is working as best we can
- set a new version number in `package.json`
- generate a changelog
- create a new release commit, git tag, and push to our upstream GitHub repo
- create a Release on GitHub

To help automate this process, we use the [release-it](https://www.npmjs.com/package/release-it) command line tool.

### Using release-it

To create a new release, follow these steps:

1. Make sure you've done everything in the Setup section above, including your `GITHUB_TOKEN`.
1. Make sure your `master` branch is up-to-date, and you have the most recent git tags in your repo: `git pull upstream master --tags`.
1. Run `npm outdated` to see a report of [outdated npm packages](https://docs.npmjs.com/cli-commands/outdated.html). Examine this list and decide whether we need to update
   anything now, or before the next release. _Please file a new Issue to update
   anything that is outdated_.
1. Determine what the new version number should be based on [semantic versioning](https://docs.npmjs.com/about-semantic-versioning).
1. Use `npm run release` to actually do the full release

As part of the process, [release-it](https://www.npmjs.com/package/release-it) will
perform a number of checks, and fail if anything isn't right. For example, your
working directory must be clean (no local file changes), you must have an `upstream`
remote, the tests must pass, etc.

### Releases

Once a release is complete, a new [git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) will be created in the project's history. A new
[GitHub Release will also be created](https://github.com/Seneca-CDOT/telescope/releases).

## Domains

Our release processes updated a number of domains, depending on what you do:

| Name            | Domain                       | Updated When Change To |
| --------------- | ---------------------------- | ---------------------- |
| Login           | login.telescope.cdot.systems | master (automatic)     |
| Staging         | dev.telescope.cdot.systems   | master (automatic)     |
| Production      | telescope.cdot.systems       | release (git tag)      |
| Zeit Production | telescope-dusky.now.sh       | master (automatic)     |
