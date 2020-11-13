# feedparser-promised

[![npm version](https://img.shields.io/npm/v/feedparser-promised.svg)](https://www.npmjs.com/package/feedparser-promised)
[![downloads](https://img.shields.io/npm/dm/feedparser-promised.svg)](https://www.npmjs.com/package/feedparser-promised)
[![npm license](https://img.shields.io/npm/l/feedparser-promised.svg)](https://spdx.org/licenses/MIT)
[![travis build](https://img.shields.io/travis/alabeduarte/feedparser-promised.svg)](https://travis-ci.org/alabeduarte/feedparser-promised)
[![codeclimate score](https://img.shields.io/codeclimate/github/alabeduarte/feedparser-promised.svg)](https://codeclimate.com/github/alabeduarte/feedparser-promised)

Wrapper around [feedparser](https://github.com/danmactough/node-feedparser) with promises.

## Install

```
  $ npm install --save feedparser-promised
```

## Usage

```javascript
  const feedparser = require('feedparser-promised');

  const url = 'http://feeds.feedwrench.com/JavaScriptJabber.rss';

  feedparser.parse(url).then(items =>
    items.forEach(item => console.log('title:', item.title));
  ).catch(console.error);
```

## Using [HTTP Node.js](https://nodejs.org/api/http.html#http_http_get_options_callback) options
```javascript
const feedparser = require('feedparser-promised');

const httpOptions = {
  uri: 'http://feeds.feedwrench.com/JavaScriptJabber.rss',
  timeout: 3000,
  gzip: true,
  // ...
};

feedparser.parse(httpOptions).then(items => { /* do your magic here */ });
```

## Using [Feedparser](https://github.com/danmactough/node-feedparser#options) options
```javascript
const feedparser = require('feedparser-promised');

const httpOptions = {
  uri: 'http://feeds.feedwrench.com/JavaScriptJabber.rss',
  // ...
};

const feedparserOptions = {
  feedurl: 'http://feeds.feedwrench.com/JavaScriptJabber.rss',
  normalize: false,
  addmeta: false,
  resume_saxerror: true
};

feedparser.parse(httpOptions, feedparserOptions).then(items => { /* do your magic here */ });
```

### List of article properties

* `title`: title
* `description`: frequently, the full article content
* `summary`: frequently, an excerpt of the article content
* `link`: link
* `origlink`: when FeedBurner or Pheedo puts a special tracking url in the `link` property, `origlink` contains the original link
* `permalink`: when an RSS feed has a `guid` field and the `isPermalink` attribute is not set to `false`, `permalink` contains the value of `guid`
* `date`: most recent update
* `pubdate`: original published date
* `author`: author
* `guid` a unique identifier for the article
* `comments`: a link to the article's comments section
* `image`: `an Object containing `url` and `title` properties
* `categories`: an Array of Strings
* `source`: an Object containing `url` and `title` properties pointing to the original source for an article; see the [RSS Spec](http://cyber.law.harvard.edu/rss/rss.html#ltsourcegtSubelementOfLtitemgt) for an explanation of this element
* `enclosures`: an Array of Objects, each representing a podcast or other enclosure and having a `url` property and possibly `type` and `length` properties
* `meta`: an Object containing all the feed meta properties; especially handy when using the EventEmitter interface to listen to `article` emissions

### Contributing
There are many ways to contribute, such as fixing opened issues, creating them
or suggesting new ideas.
Either way will be very appreciated.

If there are issues open, I recommend you follow those steps:

* Create a branch feedparser-promised#{issue_number}; eg: feedparser-promised#42
* Please, remember to write unit tests.
* Send a pull request!

### Running Tests

```bash
$ npm test
```

## License

`feedparser-promised` is released under the [MIT License](http://www.opensource.org/licenses/MIT).
