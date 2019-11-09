# Contributing to Telescope

## Welcome!
We are all eager to work on telescope, and this document will help you to get started!

## Issues
Before creating an issue:
* Please look through the MVP Features listed below for inspiration.
* Check [open issues](https://github.com/Seneca-CDOT/telescope/issues). Someone else may be working on the same thing!
* If they are, reach out and try to help. 

## Pull Requests
Please submit pull requests in response to open issues. If you have a bug or feature, bring it up in issues first, to avoid two or more people working on the same thing.


## Environment Setup
**Prerequisites:**
* [Node.js (npm)](https://nodejs.org/en/download/)
* [Redis](https://redis.io/download)

**Redis Set Up**
Some helpful guides:
* [Redis for Linux](https://redis.io/download#installation) (recommended but not required)
* [Redis for Windows Subsystem for Linux](https://anggo.ro/note/installing-redis-in-ubuntu-wsl/) (not recommended by Redis)
* Redis for Windows - You can use [this](https://github.com/tporadowski/redis/releases) installer to get up and running quickly for now.
* Redis for MacOS - need instructions
An easier solution would be to use Docker.

**Setup**
1. Navigate to the root directory of telescope.
1. Copy env.example to .env to create a new environment configuration.
1. Replace default key values in .env with credentials. 
1. Run `npm install`.
1. Run `npm test`
1. IF eslint detect some issues run `npm run eslint-fix` before manually fixing the issue (Will save you time :smile:).
1. Run `npm start` to start telescope.
*If you get a series of errors, you may have to start redis-server depending on your installation configuration, do this by running the command `redis-server` in a seperate command window).*

**THE LIST OF THINGS THAT MUST BE DONE BY A CONTRIBUTOR BEFORE filling A PR**
1. Run `npm test`
1. IF eslint detect some issues run `npm run eslint-fix` before manually fixing the issue (Will save you time :smile:).

## MVP Features
These features are the basic elements of what we are trying to accomplish, and are explained in further detail in [overview.md](https://github.com/Seneca-CDOT/telescope/blob/master/docs/overview.md#mvp-features):

- [ ] Written in one of node.js or Python, or a mix of the two if that makes sense
- [ ] Able to parse and use the existing [Planet Feed List format](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List), especially RSS and Atom feeds
- [ ] Static HTML generated from current feed posts, shown in chronological order
- [ ] Logging, especially of errors or other issues when downloading and parsing feeds
- [ ] Process should be automatic, running continually, restart itself if it crashes
- [ ] Ability to send emails to admins, users when things go wrong or need attention
- [ ] Everything is configurable.  It should be easy for the admin(s) to turn features on and off via "feature flags."  It should be easy to merge new features and flag them off until they are ready to be used.
- [ ] Test harness and an initial set of tests
- [ ] Use of CI/CD, running tests and doing automatic deploys
- [ ] Running on Seneca's [Kubernetes](https://kubernetes.io/) container cloud

