## Frontend Development with Next

The Telescope frontend is currently being developed using Typescript and NextJS. We encourage all new developers to read the [NextJS docs](https://nextjs.org/docs) in order to familiarize themselves with how Next works as well as the [Typescript docs](https://www.typescriptlang.org/docs/) in order to understand how the language operates.

## Design choices

When working on a new component for the Telescope frontend, please consider the following:

- We do not use React.FC/React.FunctionalComponent when making our components. The reason for this can be found [here](https://github.com/facebook/create-react-app/pull/8177).
- We require all components being created to strictly be exported directly inside the components folder. This is due to the way NextJS processes requests, where we build our pages in the `pages` folder using the components made there.
- Our style and theme choices can be found [here](./theme-and-colours.md).

## Examples

- [This link](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets) provides some examples that utilize Typescript with common React activities such as creating components and utilizing React Hooks.
- [This link](https://material-ui.com/guides/typescript/) provides examples on how to utilize Material-UI with Typescript. This will be helpful for those contributing to the styling and theming of Telescope
- [This link](https://github.com/vercel/next.js/tree/canary/examples/with-typescript) provides an example NextJS project, useful to see how a NextJS project works
- [This link](https://github.com/vercel/next.js/tree/canary/examples) provides example cases all utilizing NextJS. Useful for understanding a specific case related to the issue you're currently working on.
