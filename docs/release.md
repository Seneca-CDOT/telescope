# Release

As Telescope matures, we are trying to improve our build, release, and deployment
processes and tools. This is an on-going effort, and all maintainers should
try to keep this document up-to-date to reflect our current practices.

## Setup

In order for the automated release process to work, you must do the following:

- have admin rights to [the Telescope repository on GitHub](https://github.com/Seneca-CDOT/telescope)
- set up an `upstream` remote pointing to [Telescope](https://github.com/Seneca-CDOT/telescope) on your machine

## Create a Release

When we release Telescope, we need to do a number of things:

- run our linters, tests, and make sure the code is working as best we can
- set a new version number in `package.json`
- create a new release commit, git tag, and push to our upstream GitHub repo
- generate a changelog
- create a Release on GitHub

We use the [npm-version](https://docs.npmjs.com/cli/v6/commands/npm-version) command line tool to help us automate the release process.

### Using npm-version

To create a new release, follow these steps:

1. Make sure your `master` branch is up-to-date, and you have the most recent git tags in your repo: `git pull upstream master --tags`.
1. Run `npm outdated` to see a report of [outdated npm packages](https://docs.npmjs.com/cli-commands/outdated.html). Examine this list and decide whether we need to update
   anything now, or before the next release. _Please file a new Issue to update
   anything that is outdated_.
1. Make sure your working tree is clean.
1. Determine what the new version _string_ should be based on [semantic versioning](https://github.com/npm/node-semver#functions). New version should be a valid semver string. In our project, that would usually be `minor` (e.g. `1.5.0`, `1.6.0`, `1.7.0`) or `major` (e.g. `1.0.0`, `2.0.0`). See [npm-version docs](https://docs.npmjs.com/cli/v6/commands/npm-version) to learn more about what options are available for the new version string.
1. Use `npm version <new-version-string> -m "Release message"` to trigger the automated release workflow. For example, `npm version minor -m "Release 1.6.0"` will increase the minor version of the project (`1.5.x` -> `1.6.0`). To make a major release, we can use `npm version major -m "Release 2.0.0"` (`1.x.x` to `2.0.0`).

`npm-version` will proceed to run tests locally. If successful, it will also bump the `version` in [package.json](https://github.com/Seneca-CDOT/telescope/blob/master/package.json), create a new [`git tag`](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and push both the code and the tags to `upstream master` (which you should have configured to point to https://github.com/Seneca-CDOT/telescope at this point).
That will trigger our [release workflow](https://github.com/Seneca-CDOT/telescope/blob/master/.github/workflows/release.yml), which will run all tests in the cloud. If tests finish successfully, [the release workflow](https://github.com/Seneca-CDOT/telescope/blob/master/.github/workflows/release.yml) will proceed to [generate a changelog](https://github.com/lob/generate-changelog#usage) and create a new [GitHub Release](https://github.com/Seneca-CDOT/telescope/releases).

## Domains

Our release processes updated a number of domains, depending on what you do:

| Name            | Domain                       | Updated When Change To |
| --------------- | ---------------------------- | ---------------------- |
| Login           | login.telescope.cdot.systems | master (automatic)     |
| Staging         | dev.telescope.cdot.systems   | master (automatic)     |
| Production      | telescope.cdot.systems       | release (git tag)      |
| Zeit Production | telescope-dusky.now.sh       | master (automatic)     |
