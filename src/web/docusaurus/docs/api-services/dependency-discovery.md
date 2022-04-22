---
sidebar_position: 6
---

# Dependency Discovery Service

## Overview

The dependency discovery service provides information about dependencies of Telescope. That information is mostly related to GitHub issues for the purposes of searching what issues to contribute to open-source projects.

## API endpoints

### Get a list of dependency names

To start with the service, you can get the names of dependencies that Telescope uses.
Be aware that this route will return all the names that the service currently stores (pagination is not available, as of yet).

```
GET /projects
```

#### Parameters

There are no parameters to provide.

#### Code Samples

##### Shell

```bash
curl http://localhost/v1/dependency-discovery/projects
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/dependency-discovery/projects');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

It will return a JSON-like array of strings, where each element is a dependency name that the service recognizes.

##### Unsuccessful response

While unexpected, the service could provide a status error code. A few reasons as to why this could happen:

- the service crashed,
- the service took to long to give a response (which could be because it is stuck on reading a super long file!),
- or something else.

In a case like this, it is better to report it rather than just waiting!

### Get NPM-related information from a dependency name

While not necessarily related to GitHub, the service also provides NPM-related information for a given dependency name. This is possible since all of Telescope's dependencies are NPM packages!

```
GET /projects/{name}

or

GET /projects/{namespace}/{name}
```

#### Parameters

| Name      | Type   | In   | Description                                                                                                                                                                                                                                                                 |
| --------- | ------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace | string | path | _Required_. The namespace is the part of a NPM package name that starts with an `@` symbol (e.g. `@babel/core`, where `@babel` is the namespace). If the `name` is absent, then the namespace is to considered the name of the package that has no namespace (e.g. `jest`). |
| name      | string | path | _Optional_. The name of a project that is prefixed with a namespace.                                                                                                                                                                                                        |

#### Code Samples

##### Shell

```bash
curl http://localhost/v1/dependency-discovery/projects/@babel/core
```

```bash
curl http://localhost/v1/dependency-discovery/projects/jest
```

#### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/dependency-discovery/projects/@babel/core');
```

```js
fetch('http://localhost/v1/dependency-discovery/projects/jest');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

```json
{
  "id": "@babel/core",
  "license": "MIT",
  "gitRepository": {
    "type": "git",
    "url": "https://github.com/babel/babel",
    "directory": "packages/babel-core",
    "issuesUrl": "https://github.com/babel/babel/issues?q=is%3Aopen+is%3Aissue+label%3A%22hacktoberfest%22%2C%22good+first+issue%22%2C%22help+wanted%22"
  }
}
```

```json
{
  "id": "jest",
  "license": "MIT",
  "gitRepository": {
    "type": "git",
    "url": "https://github.com/facebook/jest",
    "issuesUrl": "https://github.com/facebook/jest/issues?q=is%3Aopen+is%3Aissue+label%3A%22hacktoberfest%22%2C%22good+first+issue%22%2C%22help+wanted%22"
  }
}
```

##### Not Found

```
Status: 404 Not Found
```

This could happen if you were to give a name of a dependency that the service does not recognize. Even if the dependency were truly a Telescope dependency, if the service does not register it as one, it will not work. This could happen for dependencies that are so further down the dependency tree that the service cannot register them.

### Get GitHub issues of a dependency's GitHub repo given its name

The issues that appear are labelled with `good first issue`, `help wanted`, or `hacktoberfest`.

```
GET /github/{name}

or

GET /github/{namespace}/{name}
```

#### Parameters

| Name      | Type   | In   | Description                                                                                                                                                                                                                                                                 |
| --------- | ------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| namespace | string | path | _Required_. The namespace is the part of a NPM package name that starts with an `@` symbol (e.g. `@babel/core`, where `@babel` is the namespace). If the `name` is absent, then the namespace is to considered the name of the package that has no namespace (e.g. `jest`). |
| name      | string | path | _Optional_. The name of a project that is prefixed with a namespace.                                                                                                                                                                                                        |

#### Code Samples

##### Shell

```bash
curl http://localhost/v1/dependency-discovery/github/@babel/core
```

```bash
curl http://localhost/v1/dependency-discover/github/jest
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/dependency-discovery/github/@babel/core');
```

```js
fetch('http://localhost/v1/dependency-discovery/github/jest');
```

#### Response

##### Successful response

```
Status: 200 OK
```

The following response is for the `@babel/core` package.

````json
[
  {
    "htmlUrl": "https://github.com/babel/babel/issues/7357",
    "title": "injecting external-helpers in a node app",
    "body": "<!---\r\nThanks for filing an issue 😄 ! Before you submit, please read the following:\r\n\r\nSearch open/closed issues before submitting since someone might have asked the same thing before!\r\n\r\nIf you have a support request or question please submit them to one of this resources:\r\n\r\n* Slack Community: https://slack.babeljs.io/\r\n* StackOverflow: http://stackoverflow.com/questions/tagged/babeljs using the tag `babeljs`\r\n* Also have a look at the readme for more information on how to get support:\r\n  https://github.com/babel/babel/blob/master/README.md\r\n\r\nIssues on GitHub are only related to problems of Babel itself and we cannot answer \r\nsupport questions here.\r\n-->\r\n\r\nChoose one: is this a bug report or feature request? (docs?) bug report\r\n\r\nI'm trying to use a package that assumes that the external-helpers are available as a global. From the [docs](https://babeljs.io/docs/plugins/external-helpers/#injecting-the-external-helpers), I should be able to inject them to `global` in my node app by using `require(\"babel-core\").buildExternalHelpers();`. However, use of that still results in the following error: `ReferenceError: babelHelpers is not defined`\r\n\r\n### Babel/Babylon Configuration (.babelrc, package.json, cli command)\r\nSince the `buildExternalHelpers()` function needs to run before the package is imported and my app uses es module imports, I'm using a bootstrap file as an entry point that is ignored from transpilation and just tries to inject the helpers before loading the actual app:\r\n\r\n```js\r\nrequire(\"babel-core\").buildExternalHelpers();\r\nconst app = require('./app');\r\n```\r\n\r\n### Expected Behavior\r\n\r\n`babelHelpers` should be added to `global` so that it is available for the package that assumes it is available there.\r\n\r\nfrom the docs:\r\n> This injects the external helpers into `global`.\r\n\r\n### Current Behavior\r\n\r\n`babelHelpers` is not made available on `global`, resulting in `ReferenceError: babelHelpers is not defined`\r\n\r\n### Possible Solution\r\n\r\nThe docs also [mention](https://babeljs.io/docs/plugins/external-helpers/#getting-the-external-helpers) generating a helpers file with `./node_modules/.bin/babel-external-helpers [options] > helpers.js`. It wasn't obvious to me that this file could be imported to accomplish the same goal as `buildExternalHelpers()` until I started reading the source of that file. Importing that file instead does work for my app. I'll need this file elsewhere, so I'll likely just continue importing that instead, even if there is a way to use `buildExternalHelpers()`.\r\n\r\nWith that approach, my bootstrap file has the following contents instead:\r\n\r\n```js\r\nrequire('../../vendor/babel-helpers');\r\nconst app = require('./app');\r\n```\r\n\r\n### Your Environment\r\n<!--- Include as many relevant details about the environment you experienced the bug in -->\r\n\r\n| software         | version(s)\r\n| ---------------- | -------\r\n| Babel            | 6.26.0\r\n| node             | 8.9.4\r\n| npm              | 5.6.0\r\n| Operating System | macOS High Sierra \r\n\r\n### Forum\r\n\r\nWhile I was still trying to find a working solution, I was trying to find the best place to ask questions. The website still links to a discourse forum that no longer seems to exist. It'd be a good idea to either remove the link from the site or at least have it link to somewhere that describes the currently recommended approach for getting that type of help.\r\n",
    "createdAt": "2018-02-08T20:49:23Z"
  },
  ...
]
````

The following is for the `jest` package.

````json
[
  {
    "htmlUrl": "https://github.com/facebook/jest/issues/12556",
    "title": "[Bug]: Outdated webpack example in the docs",
    "body": "### Version\r\n\r\ndocs\r\n\r\n### Steps to reproduce\r\n\r\nThis page in the docs about Webpack is completely outdated:\r\nhttps://jestjs.io/docs/webpack\r\n\r\nThe syntax for loaders looks really strange and it probably originates from Webpack 2 or 3 (?) . In Webpack 4+ the syntax is completely different.\r\n\r\nAdditionally in Webpack 5 (which is present for about 1.5 year), the `file-loader` and `url-loader` are deprecated and should not be used. Instead the `asset modules` should be used.\r\n\r\n### Expected behavior\r\n\r\nThis page in the docs about Webpack should be up to date with Webpack 5\r\nhttps://jestjs.io/docs/webpack\r\n\r\n### Actual behavior\r\n\r\nThis page in the docs about Webpack is completely outdated:\r\nhttps://jestjs.io/docs/webpack\r\n\r\n### Additional context\r\n\r\n_No response_\r\n\r\n### Environment\r\n\r\n```shell\r\nDoes not apply. This is the bug about Jest docs.\r\n```\r\n",
    "createdAt": "2022-03-07T21:32:54Z"
  },
  ...
]
````

##### Not Found

```
Status: 404 Not Found
```

This could happen if you provide a dependency name that that service has not registered.

##### Forbidden

```
Status: 403 Forbidden
```

This could happen when the service reached its rate limit and cannot request to the GitHub API temporarily.

##### Server errors

There could be a 5xx code given due to certain situations, like the request to the GitHub API failing, or something else must have happened.
