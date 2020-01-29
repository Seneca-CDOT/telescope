# Contributing to Telescope

## Welcome!

We are all eager to work on telescope, and this document will help you to get started!

For community discussions, join our [#telescope Slack channel](https://seneca-open-source.slack.com/archives/CS5DGCAE5).

## Issues

Before creating an issue:

- Please look through the MVP Features listed below for inspiration.
- Check [open issues](https://github.com/Seneca-CDOT/telescope/issues). Someone else may be working on the same thing!
- If they are, reach out and try to help.
- Use [our Labels](https://github.com/Seneca-CDOT/telescope/labels) to help others quickly understand what an issue is all about.

## Pull Requests

Please submit pull requests in response to open issues. If you have a bug or feature, bring it up in issues first, to avoid two or more people working on the same thing. See workflow information below.

## Environment Setup

For instructions on how to setup your Telescope environment, please see [Environment Setup](https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md).

### SAML Setup

- Run `bash ./generate_ssl_certs.sh` in terminal

### Setup Telescope

1. Navigate to the root directory of telescope.
1. Copy env.example to .env to create a new environment configuration.
1. Replace default key values in .env with credentials.
1. Start Redis using:

   - Docker: `docker-compose up -d redis`

   _To stop the Docker container for Redis, run:_ `docker-compose stop redis`

   - Native Install: `redis-service`

   _To stop Redis, ctrl+c the window running the redis server._

1. Run `npm install`.
1. Run `npm test`
1. IF eslint detect some issues run `npm run eslint-fix` before manually fixing the issue (Will save you time :smile:) and then run `npm test` again.
1. Run `npm run jest-watch` to watch files for any changes and rerun tests related to changed files.
1. Run `npm start` to start telescope.

### Frontend Development

The Telescope frontend app lives in [`src/frontend`](../src/frontend) and is
built using the React frontend framework [GatsbyJS](https://www.gatsbyjs.org/).
You are encouraged to read the [GatsbyJS docs](https://www.gatsbyjs.org/docs/)
in order to understand how everything works, and what the [files and folders](https://www.gatsbyjs.org/docs/gatsby-project-structure/#folders) mean.

From the root of the project, you can run a number of GatsbyJS specific npm scripts:

1. [`npm run develop`](https://www.gatsbyjs.org/docs/gatsby-cli/#develop) to start the development server
1. [`npm run build`](https://www.gatsbyjs.org/docs/gatsby-cli/#build) to build the site in `src/frontend/public` for production
1. [`npm run serve`](https://www.gatsbyjs.org/docs/gatsby-cli/#serve) to serve the production site in `src/frontend/public` for testing
1. [`npm run clean`](https://www.gatsbyjs.org/docs/gatsby-cli/#clean) to delete generated build files and folders

## Workflow in git and GitHub

### Getting Started

When working on fixing bugs, please use the following workflow:

1. First, make sure your editor is set up correctly to use our preferred formats. We use tools like [Prettier](https://prettier.io/) to help keep our code consistently formatted. If you're using [VSCode](https://code.visualstudio.com/) as your editor, we have a number of pre-configured project settings and extensions you can install (you'll be prompted when you open the Telescope project root). If you're using another editor, [check to see if there is a plugin you can use](https://editorconfig.org/#download). This will help you write code that is consistent with our coding format. However, we'll also automatically format your code when you commit in git.
1. If you haven't done so already, add an `upstream` remote so you can stay in sync:
   ```
   git remote add upstream https://github.com/Seneca-CDOT/telescope.git
   ```
1. Before you do any new work, always update your `master` branch:
   ```
   git checkout master
   git pull upstream master
   ```
1. Additionally, it is a good idea to run `npm install` to make sure everything is up to date and you have everything necessary.
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

### Testing Your Code

Run the test suite, using `npm test`. Fix any lint errors, warnings, or other failures (NOTE: if you're not sure what an eslint rule means, [look it up in the docs](https://eslint.org/docs/rules/)):

```
npm test
...if there are lint errors, try having eslint fix them for you
npm run eslint-fix
npm test
...manually fix any errors yourself, rerunning npm test each time to confirm
```

You can also run the tests in _watch_ mode, so that they will automatically ru-run
when you make changes:

```
npm run jest-watch
```

In addition, you can run individual tests, in both normal or watch mode, by
adding the name of a file. For example, to run tests in a file called parser.test.js:

```
npm test parser
```

You can add feeds to the queue manually using `add-feed` followed by the name of the blogger and url of the feed. This can be useful for testing purposes.

First, add a link to the binary:

`npm link`

Then use `add-feed`

`add-feed --name "Bender Bending Rodriguez" --url futurama.wordpress.com/feed`

### Squashing Commits

Before creating your pull request you may want to squash all your commits down to one. Ideally this should be done before you rebase on the upstream master.

Before you begin make sure you are in your own branch and any and all changes you wish to make are commited.

1. The first step is to find the base commit where your branch began. To find this you can run `git log` and look through the history for the commit before your first commit. Copy the hash from this commit.
1. Run `git rebase -i` followed by the base commit's hash.
   Example: `git rebase -i 1bab04f`
1. A `git-rebase-todo` file will then open up in your default editor. If you have no set one then you will be prompted to edit it in terminal using VIM.
   Example:

```
pick 52a4ced Build
pick b85d7a9 Final Build
```

1. On this screen you will need to decide what you want to do with each commit. Most commonly you will be choosing to squash, fixup or reword your commits. The example below will create one commit instead of 2 with the commit message being "Build".
   Example:

```
pick 52a4ced Build
fixup b85d7a9 Final Build
```

1. Once this is done you can save and close the file. (Or if using VIM press esc then : followed by wq to save and quit).

### Submitting Your Code

1. When you're done, push to your fork, using the same name as your branch:
   ```
   git push origin issue-123
   ```
1. This will give you a link to GitHub to create a Pull Request.
1. Create your Pull Request, and give it a title `Fix #123: short description of fix` (NOTE: the "Fix #123" part, which will [automatically close the issue](https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords) when this gets merged) as well as a full description to talk about everything you did, any follow-up work that's necessary, how to test the code, etc.
1. Check the automatic Continuous Integration builds that happen in your Pull Request. Make sure they go green, not red. If something goes red, first investigate the error then ask for help if you're not sure how to solve it.
1. When you get review comments to fix issues, make those changes and update your branch (you can optionally squash these new commits):
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
   ...this is likely necessary to update your node_modules/, see below
   git push origin issue-123 -f
   ```

If you get stuck with any of this, ask in your issue or pull request, and we'll give you a hand.

## Making changes to package.json

If you are doing any work that relates to the `package.json` file, you need to do this with care. Here are some tips:

- we don't include `package-lock.json` in our tree. Instead, we use [exact](https://docs.npmjs.com/misc/config#save-exact) versions in `package.json`. When you `npm install` a package, we specify an exact version number vs. using a semver range.
- don't hand-edit this file to add packages. Instead, use `npm install --save package-name` or `npm install --save-dev package-name` to add packages to the `dependencies` or `devDependencies` sections.
- if you touch `package.json`, always re-run `npm install`.

## Logging

The logger.js module, in the lib directory under the src folder of the repository, exports a logger instance that can be imported in other files and used to log important events in production as well as help in debugging during development. Refer to [logging.md](logging.md) for more details.

## Reports

There are a number of reports that get generated, and can aid in developer understanding.

The first is test coverage information. To generate the report, run the tests:

```
npm run coverage
```

After the tests complete, a text summary report is printed. However, a much more
useful, dynamic HTML version is created in `coverage/lcov-report/index.html`.

The second report is for [Webhint](https://webhint.io/) information about the frontend.
To generate this report:

```
npm run webhint
```

This will start the web server and run webhint in a browser. A text summary will
be printed to the console, and a dynamic HTML version created in `hint-report/http-localhost-3000/index.html`.

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
