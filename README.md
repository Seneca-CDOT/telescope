# Telescope <img align="left" width="100" height="100" src=https://github.com/brucremo/telescope/blob/master/images/telescope-logo.png>

[![Build Status](https://travis-ci.org/Seneca-CDOT/telescope.svg?branch=master)](https://travis-ci.org/Seneca-CDOT/telescope)
[![CircleCI](https://circleci.com/gh/Seneca-CDOT/telescope.svg?style=svg)](https://circleci.com/gh/Seneca-CDOT/telescope)
[![js-airbnb/prettier-style](https://img.shields.io/badge/code%20style-airbnb%2Fprettier-blue)](https://github.com/airbnb/javascript)

A tool for tracking blogs in orbit around Seneca's open source involvement. We will be working on updating this software and adding key features that can be found below listed ad MVP features.

An initial discussion of the project is available in the [Overview](docs/overview.md) document.
For contribution, the docs can be found here [Contribution](docs/CONTRIBUTING.md)

## Quick Setup Guide

Clone the source locally:

```sh
$ git clone https://github.com/Seneca-CDOT/telescope.git
$ cd telescope
```

Copy env.example to .env to create a new environment configuration.
Replace default key values in .env with credentials.

Install project dependencies:

```sh
$ npm install
```

Test the app:

```sh
$ npm test
```

## MVP Features

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
- [ ] Developer and User docs

# Getting the project legacy code

You may want a copy of the legacy project for later reading.

To grab a local copy of the legacy project.. you can run [wget](https://www.gnu.org/software/wget/).

To build the project for yourself you can follow the instructions in the [INSTALL](https://people.gnome.org/~jdub/bzr/planet/devel/trunk/INSTALL) file.

**Linux/Mac**

```
wget -r --no-parent https://people.gnome.org/~jdub/bzr/planet/devel/trunk/
```

**Windows**

1. Download wget binary [here](http://wget.addictivecode.org/FrequentlyAskedQuestions.html#download)
2. `cd path/to/downloaded/wget`
3. `wget -r --no-parent https://people.gnome.org/~jdub/bzr/planet/devel/trunk/`

## License

BSD ©
