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

### Prerequisites:

- [Node.js (npm)](https://nodejs.org/en/download/)
- [Redis](https://redis.io/) (2 methods)
  - Use [Docker and docker-compose](#docker-and-docker-compose-set-up)
  - Install as a [native application](#using-redis-as-a-native-application)

### Using Redis as a native application

#### Linux:

Install Redis using your distribution's package manager, for example:

- Ubuntu based: `sudo apt install redis`
- Red Hat, Fedora: `sudo dnf install redis`

_Once Redis is installed, you can start it in a terminal by running:_

```
redis-server
```

#### Windows:

We are using [Chocolatey package manager](https://chocolatey.org/) to install Redis on Windows. To get Chocolatey, simply follow this [guide](https://chocolatey.org/install) and run the following commands:

1. To install Redis: `choco install redis-64 -v`
1. To set Redis as a windows service: `redis-server --service-install`
1. To start Redis: `redis-server --service-start`
1. To check if running and display server information: `redis-cli info`

### Docker and Docker-Compose Set Up

#### Windows 10 Pro, Enterprise, or Education

1. Get [Docker for Desktop For Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
1. Docker for Desktop comes with docker-compose installed.

#### MacOS (Sierra 10.12 or above)

1. Get [Docker for Desktop For Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
1. Docker for Desktop comes with docker-compose installed.

#### Windows 10 Home Edition and Windows Subsystem for Linux (WSL)

Docker Desktop for Windows is not available on Home Edition, and you cannot run docker in WSL (Windows Subsystem for Linux). You can get the environment set up using **one** of these three methods:

- Get [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) instead of Docker Desktop for Windows. Make sure that your system can do virtualization and enable virtualization.
- Set up a virtual machine to run Linux Ubuntu
  1. Make sure your system can do virtualization and enable it.
  1. [Download VirtualBox](https://www.virtualbox.org/wiki/Downloads)
  1. [Follow this helpful youtube tutorial to create a virtual machine with Ubuntu](https://www.youtube.com/watch?v=ThsxqznrgCw&t=401s)
  1. Use the Linux installation instructions [below](#linux-Ubuntu).
- Update your home edition to Windows 10 Education Edition
  1. Download Windows 10 Education Edition from the [Seneca Software Center](https://senecacollege.onthehub.com/WebStore/OfferingDetails.aspx?o=c0bd2c36-a530-e511-940e-b8ca3a5db7a1)
  1. Update your OS using the installation instructions.
  1. Use [Windows 10 Education Edition](#Windows-10-Pro,-Enterprise,-or-Education) set up instructions.

#### Linux-Ubuntu

This guide is sourced from the official [Docker-CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [Docker-Compose](https://docs.docker.com/compose/install/) Installation Documentation.

**Install Docker Engine - Community Edition**

1. Update the apt package index: `sudo apt-get update`
2. Install packages to allow apt to use a repository over HTTPS:

```
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

3. Add Docker’s official GPG key: `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
4. Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88, by searching for the last 8 characters of the fingerprint: `sudo apt-key fingerprint 0EBFCD88`
5. Use the following command to set up the stable repository:

```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

6. Update the apt package index again: `sudo apt-get update`
7. Install the latest version of Docker Engine community: `sudo apt-get install docker-ce docker-ce-cli containerd.io`
8. Add yourself to the Docker group ([source](https://docs.docker.com/install/linux/linux-postinstall/)):
   1. Create the Docker group: `groupadd docker`
   1. Add your user to the group: `sudo usermod -aG docker $USER`
   1. Log out and log back in (you may have to restart if you are running through a virtual machine)
9. Verify your installation by running `docker run hello-world`. This should print a hello world paragraph that includes a confirmation that Docker is working on your system.
   _NOTE: This may cause errors if you have already tried to run docker before. If you get errors then run the following commands to reset it:_

```
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

10. Now run docker as a service on your machine, on startup:
    1. Enable docker on startup: `sudo systemctl enable docker`
    1. Disable docker on startup: `sudo systemctl disable docker`

**Install Docker-Compose**

11. Run to download the current stable version of Docker-Compose:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

12. Apply executable permissions to the downloaded file: `sudo chmod +x /usr/local/bin/docker-compose`
13. Check installation using: `docker-compose --version`

_NOTE: This will not work on WSL (Windows Subsystem for Linux). Use the approach listed above under WSL._

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

## Workflow in git and GitHub

### Getting Started

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
1. Additionally, it is a good idea to run `npm install` to make sure everything is up to date and you have everything neccessary.
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

1. Run the test suite, using `npm test`. Fix any lint errors, warnings, or other failures (NOTE: if you're not sure what an eslint rule means, [look it up in the docs](https://eslint.org/docs/rules/)):
   ```
   npm test
   ...if there are lint errors, try having eslint fix them for you
   npm run eslint-fix
   npm test
   ...manually fix any errors yourself, rerunning npm test each time to confirm
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
npm test
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
