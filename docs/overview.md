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
expectations for what a system like this can and should be.

It's not 100% clear what we need to build, which is part of the fun. It is our
hope that _you_ will leave a mark on this project, and bring your own ideas,
experience, and code to the task of defining our planet.

### Initial Project Diagram
![](https://github.com/Seneca-CDOT/telescope/blob/master/docs/images/initialProjectDiagram.jpeg)

## An Initial Set of Goals

Below is a wishlist of possible features. It is divided into three sections:

- MVP Features: things we need to sprint on immediately in order to have a working alternative for our existing Planet.
- 1.0 Features: things we only really need to worry about once we have an MVP, and the completion of which would define a major milestone.
- 2.0 Features: stretch goals for things we'd like to explore down the road. These are things we don't want to distract ourselves with at first, but which help to provide some direction as we plan our work.

None of these sections is written in stone. They are included in this document as
a starting point for our discussions and early work. Eventually, this list will
become replaced by the Issues we file together.

### MVP Features

1. Written in one of node.js or Python, or a mix of the two if that makes sense
1. Able to parse and use the existing [Planet Feed List format](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List), especially RSS and Atom feeds
1. Static HTML generated from current feed posts, shown in chronological order
1. Logging, especially of errors or other issues when downloading and parsing feeds
1. Process should be automatic, running continually, restart itself if it crashes
1. Ability to send emails to admins, users when things go wrong or need attention
1. Everything is configurable. It should be easy for the admin(s) to turn features on and off via "feature flags." It should be easy to merge new features and flag them off until they are ready to be used.
1. Test harness and an initial set of tests
1. Use of CI/CD, running tests and doing automatic deploys
1. Running on Seneca's [Kubernetes](https://kubernetes.io/) container cloud
1. Developer and User docs

### 1.0 Features

1. Database for User and Feed list replacing the text file format
1. Web-based form for adding a User and Feed to the system
1. Single Sign-On (SSO) using Seneca's [SAML2](https://developers.onelogin.com/saml) Azure Active Directory system, keeping no personal info locally in the system
1. Multiple parallel downloads of blog feeds. Downloading one feed should not affect/block downloading another, nor should it affect the overall system.
1. HTML for the final feed is templated using an existing templating system.
1. Exponential back-off of feeds when errors occur. If a feed fails, try again in N minutes, if this fails, try again in a few hours, if this fails, try tomorrow, then eventually send the user an email telling them there's a problem with their blog, before eventually marking the feed as inactive and stop using it in future updates.
1. Caching layer
1. Automatic feed curation such that repeated errors, inactive blogs, etc. remove a feed from the "active" list of feeds.
1. Use a queue to allow parallel
1. Move toward a Microservices, Serverless architecture following a [Twelve-Factor](https://12factor.net/) approach
1. Basic Automatic Analysis of Blog Posts:
   1. "Zero Content" posts are ignored. This could mean totally empty posts, but also "Hello World" single-line posts?
   1. Deal with huge posts, checking download size. Posts above a certain threshold should be ignored, and the user emailed to tell them why their post was rejected
   1. Simple text analysis: Word Length, Reading Time, Writing level, etc.
1. Incorporate data analysis results into database and HTML template for site (i.e., show this info in addition to the post itself)
1. Automatic archival of posts to the [Wayback Machine](https://archive.org/web/)
1. Add support for other "feed" formats we should support beyond the obvious ones in our MVP
1. Make sure we play well with search engine crawlers, social media metadata parsers, etc. Sharing things from the planet should be easy, and should work in Facebook, Twitter, etc.

### 2.0 Features

1. Modern front-end written in a framework that allows a more App-like experience
1. Admin Analytics Dashboard, showing things like error rates, statistics, etc.
1. Find a way to deal with posts that contain massive images, massive numbers of images and not allow a single post to overtake the entire planet.
1. Automatic Feed discovery. A user can specify their blog URL, and our system can figure out what their feed(s) are for them, supporting as many common blogging platforms as possible (WordPress, Blogger, Medium, etc). Can we somehow query each platform for a user's tags/keywords/categories/labels? Our goal is to limit the posts to "open source" work vs. everything a user has on their blog.
1. Is there some way to integrate a user's GitHub activity in our planet?
1. Figure out how to support alumni, external partners, etc. who don't have myseneca.ca/senecacollege.ca accounts.
1. More Advanced Automatic Analysis of Blog Posts:
   1. Spam Detection and elimination. Use an existing, open source spam detector to weed out problematic posts.
   1. Full Text Search: index all posts that we've ever seen, and remember the URLs so people can find things later
   1. Machine Learning analysis: Automatic Summary, Keyword Extraction, Sentiment Analysis, and any other interesting textual analysis we might want
1. Can we add "fun" to the process of writing in our community? What about things like high scores?
1. Explore alternate formats for the HTML feed page, other than simply showing chronological order
