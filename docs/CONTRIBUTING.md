# Contributing to Telescope

## Welcome!

We are all eager to work on telescope, and this document will help you to get started!

For community discussions, join our [#telescope Slack channel](https://seneca-open-source.slack.com/archives/CS5DGCAE5).

## Issues

Before creating an issue:

- Check [open issues](https://github.com/Seneca-CDOT/telescope/issues). Someone else may be working on the same thing!
- If they are, reach out and try to help.
- Use [our Labels](https://github.com/Seneca-CDOT/telescope/labels) to help others quickly understand what an issue is all about.

## Environment Setup

Telescope has many parts, and setup requires you to install a number of tools
and dependencies. For instructions on how to setup your Telescope environment, please see
the [Environment Setup documentation](https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md).

## Technologies

Telescope uses quite a few different technologies, and we have some project specific
docs available for each, including our:

- database [Redis](redis.md)
- frontend framework [GatsbyJS](gatsbyjs.md)
- frontend query language [GraphQL](graphql.md)
- single-sign-on (SSO) [login](login.md) using SAML2
- backend logging framework [Pino](logging.md)
- search engine indexing [Elasticsearch](elasticsearch.md)

If you're unsure about how something works, talk to one of us on [#telescope Slack channel](https://seneca-open-source.slack.com/archives/CS5DGCAE5).

## Workflow in Git and GitHub

We use a number of tools and automated processes to help make it easier for
everyone to collaborate on Telescope. This includes things like auto-formatting
code, linting, and automated testing. We also use git and GitHub in particular
ways.

For more information on working with our tools and our workflows, see our [Git Workflow documentation](git-workflow.md).

## Reports

We have a number of automated reports and audits that can be run on the code.
These include things like checking accessibility and performance issues in our
frontend, and determining test coverage for our automated tests.

For more information on working with these automated reports, see our [Reports documentation](reports.md).

## Releases

When doing a release of Telescope, a number of steps must be done. To help our
maintainers do this properly, we have tools and information in our [Release documentation](release.md).
