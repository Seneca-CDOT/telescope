# Development on Gitpod

You can start an automated development environment in the cloud and access it
through your browser.

We have described the environment setup steps to Gitpod in [gitpod.yml](https://github.com/Seneca-CDOT/telescope/blob/master/.gitpod.yml)
which takes care of installing dependencies, building, starting micro-services and
starting the frontend development server for you.

[Learn more about Gitpod](https://www.gitpod.io/docs)

> Gitpod is a container-based development platform that puts developer experience first.
> Gitpod provisions ready-to-code developer environments in the cloud accessible through your browser

## Open a Gitpod workspace

A Gitpod workspace includes everything developers need to be productive: source code, a
Linux shell with root/sudo, a file system, the full VS Code editing experience including
extensions, language support and all other tools and binaries that run on Linux.

1. In a browser, navigate to a Telescope's Github branch, Issue, or PR page.

2. Open in Gitpod:

- Option 1: [Install the Gitpod extension](https://www.gitpod.io/docs/browser-extension) to open the page in Gitpod with a click of a button.
- Option 2: In the address bar, prefix the entire URL with `gitpod.io/#` and press Enter.

3. Sign in with one of the listed providers.

4. You should see a browser-based VSCode serving code of that branch or PR. If you open
   an Issue, Gitpod automatically checks out a new git branch for you to work on.

5. On the first tab of the VScode terminal, the left half is for building and starting
   services, the second half waits for services to start and spins up the Next frontend dev server.
   The second tab is free for writing commands.

## Gitpod pre-builds

Gitpod continuously builds all your Git branches like a CI server. Whenever your code changes
(e.g. when new commits are pushed to your repository), Gitpod can prebuild workspaces,
i.e. run the init commands in your .gitpod.yml configuration file before you even start a workspace.

## Shut down your workspaces

Within 3 minutes after closing your workspace browser tab, it will be stopped.

Unused workspaces are automatically deleted after 14 days of inactivity.
To prevent a workspace from being deleted, you can pin it in your list of workspaces.
Pinned workspaces are kept forever.

## Resuming workspaces

Navigate to [Gitpod Dashboard](https://gitpod.io/workspaces) to select a workspace to continue
working on.

## Gitpod Pricing

Gitpod offers free 50 hours per account per month. When free hours run out, you can still keep
working on open workspaces.

For a more advanced usage, Seneca students should qualify for Gitpod student plan.

|                     | Free              | Student Unleashed |
| ------------------- | ----------------- | ----------------- |
| Repository          | Public && Private | Public && Private |
| Workspaces hours    | 50                | Unlimited         |
| Workspace timeout   | 30 minutes        | 1 + 3 boost hours |
| Parallel workspaces | 4                 | 16                |
| Team collaboration  | No                | Yes               |
| Monthly cost        | Free              | $9                |
