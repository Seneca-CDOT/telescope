---
path: '/about'
title: 'About'
---

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
single page. Our old blog Planet used to live at http://zenit.senecac.on.ca/~chris.tyler/planet/, and was run faithfully by Chris Tyler for more than a decade. We've made a re-creation of what it looked like at [http://telescope.cdot.systems/planet](http://telescope.cdot.systems/planet) if you want to see it..

## What is a Planet?

> Planet is a feed aggregator application designed to collect posts from the weblogs of members of an Internet community and display them on a single page. Planet runs on a web server. It creates pages with entries from the original feeds in chronological order, most recent entries first. --[Wikipedia](<https://en.wikipedia.org/wiki/Planet_(software)>)

In the early 2000s, before the rise of social media apps like Twitter and Facebook,
Planet solved an important problem in the free and open source community. It used
various "feed" technologies (RSS, Atom, CDF) to allow blog posts from different
platforms to be aggregated into a single page that was constantly updated with
the latest posts by people within a particular community.

[Written in Python by Jeff Waugh and Scott James Remnant](https://people.gnome.org/~jdub/bzr/planet/devel/trunk/),
Planet could be configured with a list of blog feeds and an HTML template. It would
use these to dynamically generate a site with posts in chronological order from
the specified feeds.

## In Search of a New Planet

Our original Planet was shutdown in January 2020. The [software we use was last updated 13 years ago](https://people.gnome.org/~jdub/bzr/planet/devel/trunk/).
While the underlying code has drifted further into the past, our needs have moved
forward. Maintaining the existing system, especially with the number of students
involved in open source at Seneca, has become too difficult. Our current site
often breaks, and needs manual interventions on a regular basis. Going forward,
we need a new planet to call home.

We have decided it is time to consider moving to
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
