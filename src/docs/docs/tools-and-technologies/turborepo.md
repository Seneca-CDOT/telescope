---
sidebar_position: 9
---

# Turborepo and Telescope

Telescope is configured as a monorepo: a single repository that holds many projects. [Turborepo](https://turborepo.org/) is the tool we use to manage every project within Telescope.

You will probably not have to interact with Turborepo directly but it is worth understanding how it works. The [Turborepo docs](https://turborepo.org/docs) do a good job at explaining its benefits and features.

We have a `turbo.json` file at the root of Telescope that defines the rules in what is called a `"pipeline"`.

The pipeline includes all the Turborepo commands that are available to use.

Example:

```
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

Using Turborepo:

```
# To run the build command
pnpm turbo run build

# To run the lint command
pnpm turbo run lint
```

Turborepo will look inside each workspace's `package.json` defined in `pnpm-workspace.yaml` for the specified command. More specifically, it will look at the `scripts` property and find the script that has the name matching the specified command. For each workspace, if Turborepo finds the script, it will run it.

As an example, suppose we use the pipeline mentioned above. When you run `pnpm turbo run lint`, Turborepo will go through all projects found in the `pnpm-workspace.yaml`, and look at the project's `package.json` to find the script named `lint`, and thus will run `lint` for each project that has such script.

Thanks to scripts set in the root's `package.json`, running `pnpm build` or `pnpm lint` will automatically use Turborepo so there is no need to memorize the [Turborepo CLI](https://turborepo.org/docs/reference/command-line-reference) syntax used above.
