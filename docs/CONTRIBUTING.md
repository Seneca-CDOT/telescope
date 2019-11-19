# Contributing to Telescope

## Welcome!

We are all eager to work on telescope, and this document will help you to get started!

## Issues

Before creating an issue:

- Please look through the MVP Features listed below for inspiration.
- Check [open issues](https://github.com/Seneca-CDOT/telescope/issues). Someone else may be working on the same thing!
- If they are, reach out and try to help.
- Use [our Labels](https://github.com/Seneca-CDOT/telescope/labels) to help others quickly understand what an issue is all about.

## Pull Requests

Please submit pull requests in response to open issues. If you have a bug or feature, bring it up in issues first, to avoid two or more people working on the same thing. See workflow information below.

## Environment Setup

**Prerequisites:**

- [Node.js (npm)](https://nodejs.org/en/download/)
- [Redis](https://redis.io/download)

**Redis Set Up**
Some helpful guides:

- [Redis for Linux](https://redis.io/download#installation) (recommended but not required)
- [Redis for Windows Subsystem for Linux](https://anggo.ro/note/installing-redis-in-ubuntu-wsl/) (not recommended by Redis)
- Redis for Windows - You can use [this](https://github.com/tporadowski/redis/releases) installer to get up and running quickly for now.
- Redis for MacOS - need instructions
  An easier solution would be to use Docker.

**Setup**

1. Navigate to the root directory of telescope.
1. Copy env.example to .env to create a new environment configuration.
1. Replace default key values in .env with credentials.
1. Start the docker container for Redis using `docker-compose up -d redis`
   - To stop the docker container for Redis, run `docker-compose stop redis`
1. Run `npm install`.
1. Run `npm test`
1. IF eslint detect some issues run `npm run eslint-fix` before manually fixing the issue (Will save you time :smile:) and then run `npm test` again.
1. Run `npm start` to start telescope.
   _If you get a series of errors, you may have to start redis-server depending on your installation configuration, do this by running the command `redis-server` in a seperate command window)._

## Workflow in git and GitHub

When working on fixing bugs, please use the following workflow:

1. If you haven't done so already, add an `upstream` remote so you can stay in sync:
   ```
   git remote add upstream https://github.com/Seneca-CDOT/telescope.git
   ```
1. Before you do any new work, always update your `master` branch:
   ```
   git checkout master
   git pull upstream master
   ```
1. Create a branch for your work, using the issue number:
   ```
   git checkout -b issue-123
   ```
1. Do your work, add your files manually, and commit early, commit often!
   ```
   ...edit files
   git add file1 file2 ...
   git commit -m "Updating file1 and file2 to do ..."
   ```
1. Run the test suite, using `npm test`. Fix any lint errors, warnings, or other failures (NOTE: if you're not sure what an eslint rule means, [look it up in the docs](https://eslint.org/docs/rules/)):
   ```
   npm test
   ...if there are lint errors, try having eslint fix them for you
   npm run eslint-fix
   npm test
   ...manually fix any errors yourself, rerunning npm test each time to confirm
   ```
1. When you're done, push to your fork, using the same name as your branch:
   ```
   git push origin issue-123
   ```
1. This will give you a link to GitHub to create a Pull Request.
1. Create your Pull Request, and give it a title `Fix #123: short description of fix` (NOTE: the "Fix #123" part, which will [automatically close the issue](https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords) when this gets merged) as well as a full description to talk about everything you did, any follow-up work that's necessary, how to test the code, etc.
1. Check the automatic Continuous Integration builds that happen in your Pull Request. Make sure they go green, not red. If something goes red, first investigate the error then ask for help if you're not sure how to solve it.
1. When you get review comments to fix issues, make those changes and update your branch:
   ```
   ...edit files to fix review comments
   git add file1
   git commit -m "Updated file1 to fix review comments"
   npm test
   ...if the tests fail, fix things, and repeat until they pass
   git push origin issue-123
   ```
1. Once your reviewers have approved your work, you might be asked to rebase and update your branch to deal with conflicts on `master`:
   ```
   git checkout master
   git pull upstream master
   git checkout issue-123
   git rebase master
   ...if there are conflicts, fix them
   git add file1
   git rebase --continue
   ...repeat until your rebase completes.  If you get stuck, use git rebase --abort to stop
   npm install
   ...this is likely necessary to update your node_modules/ and package-lock.json, see below
   git push origin issue-123 -f
   ```

If you get stuck with any of this, ask in your issue or pull request, and we'll give you a hand.

## Making changes to package.json and package-lock.json

If you are doing any work that relates to the `package.json` file, you need to do this with care. Here are some tips:

- don't hand-edit this file to add packages. Instead, use `npm install --save package-name` or `npm install --save-dev package-name` to add packages to the `dependencies` or `devDependencies` sections.
- if you touch `package.json`, always re-run `npm install`.
- adding dependencies will mean `package-lock.json` has to get updated. This is a generated file, and can be deleted and recreated with `npm install`.

If you have merge conflicts in `package-lock.json`, do the following:

- delete the `node_modules/` directory
- delete the `package-lock.json` file
- run `npm install`

The `package.json` and `package-lock.json` files can now be added to your commit.

## Logging

The logger.js module, in the lib directory under the src folder of the repository, exports a logger instance that can be imported in other files and used to log important events in production as well as help in debugging during development. Refer to [logging.md](logging.md) for more details.

## MVP Features

These features are the basic elements of what we are trying to accomplish, and are explained in further detail in [overview.md](https://github.com/Seneca-CDOT/telescope/blob/master/docs/overview.md#mvp-features):

- [ ] Written in one of node.js or Python, or a mix of the two if that makes sense
- [ ] Able to parse and use the existing [Planet Feed List format](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List), especially RSS and Atom feeds
- [ ] Static HTML generated from current feed posts, shown in chronological order
- [ ] Logging, especially of errors or other issues when downloading and parsing feeds
- [ ] Process should be automatic, running continually, restart itself if it crashes
- [ ] Ability to send emails to admins, users when things go wrong or need attention
- [ ] Everything is configurable. It should be easy for the admin(s) to turn features on and off via "feature flags." It should be easy to merge new features and flag them off until they are ready to be used.
- [ ] Test harness and an initial set of tests
- [ ] Use of CI/CD, running tests and doing automatic deploys
- [ ] Running on Seneca's [Kubernetes](https://kubernetes.io/) container cloud
