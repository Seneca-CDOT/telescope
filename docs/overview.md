# Telescope Overview

## Introduction

One of the key features of Seneca's open source involvement has been the
emphasis on sharing what we're working on, teaching, and learning through blogging.
We believe that one of the most rewarding parts of learning to work in the
open source community is discovering that one can become part of the fabric
of the web, find a voice, and build a following.

We also believe that reading each other's blog posts is important. In the blog
posts of our colleagues, we find that we are not alone in our struggles to make
things work, our interests in various topics, and that imposter syndrome isn't
something unique to "me."

To better enable the discovery of blogs within our community, we set up an open
source blog [Planet](<https://en.wikipedia.org/wiki/Planet_(software)>): an aggregated
feed of blog posts from Seneca faculty and students working on open source in a
single page. Our blog Planet currently lives at [http://zenit.senecac.on.ca/~chris.tyler/planet/](http://zenit.senecac.on.ca/~chris.tyler/planet/).

## What is a Planet?

> Planet is a feed aggregator application designed to collect posts from the weblogs of members of an Internet community and display them on a single page. Planet runs on a web server. It creates pages with entries from the original feeds in chronological order, most recent entries first. --[Wikipedia](<https://en.wikipedia.org/wiki/Planet_(software)>)

In the early 2000s, before the rise of social media apps like Twitter and Facebook,
Planet solved a important problem in the free and open source community. It used
various "feed" technologies (RSS, Atom, CDF) to allow blog posts from different
platforms to be aggregated into a single page that was constantly updated with
the latest posts by people within a particular community.

[Written in Python by Jeff Waugh and Scott James Remnant](https://people.gnome.org/~jdub/bzr/planet/devel/trunk/),
Planet could be configured with a list of blog feeds and an HTML template. It would
use these to dynamically generate a site with posts in chronological order from
the specified feeds.

## In Search of a New Planet

Our current Planet is dying. The [software we use was last updated 13 years ago](https://people.gnome.org/~jdub/bzr/planet/devel/trunk/).
While the underlying code as drifted further into the past, our needs have moved
forward. Maintaining the existing system, especially with the number of students
involved in open source at Seneca, has become too difficult. Our current site
often breaks, and needs manual interventions on a regular basis. Going forward,
we need a new planet to call home.

As we get ready to enter the year 2020, we have decided it is time to consider moving to
a new system. Unfortunately, almost every system that came to replace Planet has
itself become unmaintained.

Rather than try to find an existing solution, we have instead decided to try and
create one. Because we need this software, we also feel that we should
create and maintain it. And, since our need for a Planet comes out of our
collective work on open source, we think that creating it _together as open source_
would be the most desireable path forward.

## Trying to Define Our Planet

We have learned a number of things over the past decade running our own planet.
We've also watched as social media and modern technologies have reshaped our
expectations for what a system like this can and should be. This has gone into our design and implementation of our new Telescope project.

See [Architecture](architecture.md) for a more complete picture of our current design.

## Project History

- [Telescope 1.0](https://blog.humphd.org/telescope-1-0-0-or-dave-is-once-again-asking-for-a-blog/) (April 2020)
- [Telescope 2.0](https://blog.humphd.org/telescope-2-0/) (April 2021)
- [Telescope 3.0](https://blog.humphd.org/toward-telescope-3-0/) (in progress, April 2022)

### 1.0

[Telescope 1.0](https://github.com/Seneca-CDOT/telescope/releases/tag/1.0.0) realized many of our initial goals, including:

- A monolithic node.js backend web server providing REST APIs and GraphQL
- A node.js queue service for parallel feed processing
- Complete UI overhaul and design
- A GatsbyJS frontend web app using Material UI React components
- Initial SAML2 based Single Sign On Authentication
- Docker/Docker Compose based container management
- CI/CD pipelines using CircleCI and Travis CI
- Pull Request previews using Zeit Now
- A Redis database for caching feeds and posts
- An Elasticsearch database for full-text search of posts
- An Nginx reverse proxy and HTTP cache server
- Certbot for managing SSL certificates with Let’s Encrypt
- A node.js based GitHub Webhook Service to automatically manage deployments based on
- GitHub push events and webhooks to automate staging and production builds, as well as green/blue deployment
- Staging (<https://dev.telescope.cdot.systems/>) and production (<https://telescope.cdot.systems/>) deployments

### 2.0

[Telescope 2.0](https://github.com/Seneca-CDOT/telescope/releases/tag/2.0.0) improved and extended this design:

- Improved testing infrastructure, including snapshot, end-to-end, and unit testing
- Reworking CI/CD to GitHub Actions
- Improved SEO
- Adding Firebase as a back-end data store for User info
- Improvements to the SAML based Authentication, JWT Authorization, and user Sign-up Flows
  Security
- New UI Design, Logo, CSS, and Theming
- Improved Accessibility and User Experience
- Migration of Monolithic back-end to Microservices (90% complete) and API Gateway using Traefik
- Improvements to Elasticsearch and Redis
- Full port of front-end from GatsbyJS to next.js
- TypeScript rewrite of front-end
- Dependency Updates and Maintenance, both manual and automated (Dependabot)
- Bug fixes and Paying-off Technical Debt
- Progressive Web App (PWA) and Mobile UI Support
- Docker improvements
- Automation and Tooling fixes, updates, and improvements
- Improvements to nginx, caching, and certificate management
- Updates to Documentation
- Improved Developer Experience, including fixes for cross-platform differences

### 3.0

In progress.
