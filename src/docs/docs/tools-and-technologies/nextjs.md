---
sidebar_position: 4
---

# Frontend Development with Next.js

The Telescope frontend is currently being developed using Typescript and NextJS. We encourage all new developers to read the [NextJS docs](https://nextjs.org/docs) in order to familiarize themselves with how Next works as well as the [Typescript docs](https://www.typescriptlang.org/docs/) in order to understand how the language operates.

## Design choices

When working on a new component for the Telescope frontend, please consider the following:

- We do not use `React.FC` and `React.FunctionalComponent` when making our components. The reason for this can be found [here](https://github.com/facebook/create-react-app/pull/8177).
- We require all components being created to strictly be exported directly inside the components folder. This is due to the way NextJS serves page requests, where we build our pages in the `pages` folder using the components made in the `components` folder.

## Common examples to consider

- [This link](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets) provides some examples that utilize Typescript with common React activities such as creating components and utilizing React Hooks.
- [This link](https://material-ui.com/guides/typescript/) provides examples on how to utilize Material-UI with Typescript. This will be helpful for those contributing to the styling and theming of Telescope
- [This link](https://github.com/vercel/next.js/tree/canary/examples/with-typescript) provides an example NextJS project, useful to see how a NextJS project works
- [This link](https://github.com/vercel/next.js/tree/canary/examples) provides example cases all utilizing NextJS. Useful for understanding a specific case related to the issue you're currently working on.

## Colour Palette

Here is the colour palette that we use to make our web site looks pretty and up-to-date.

### Light Palette

![#121D59](https://placehold.it/15/121D59/000000?text=+) **Primary**

- hex: #121D59
- rgb: (18, 29, 89)

![#A0D1FB](https://placehold.it/15/A0D1FB/000000?text=+) **Secondary**

- hex: #A0D1FB
- rgb: (160,209,251)

![#FFFFFF](https://placehold.it/15/FFFFFF/000000?text=+) **Background**

- hex: #FFFFFF
- rgb: (255, 255, 255)

#### Typography

![#A0D1FB](https://placehold.it/15/A0D1FB/000000?text=+) **Primary**

- hex: #A0D1FB
- rgb:

![#121D59](https://placehold.it/15/121D59/000000?text=+) **Secondary**

- hex: #121D59
- rgb: (18, 29, 89)

“The Free Image Placeholder Service Favoured By Designers.” Placeholder.com, 17 Dec. 2019, placeholder.com/.

### Dark Palette

![#A0D1FB](https://placehold.it/15/A0D1FB/000000?text=+) **Primary**

- hex: #A0D1FB
- rgb: (160,209,251)

![#4f96d8](https://placehold.it/15/4f96d8/000000?text=+) **Secondary**

- hex: #4f96d8
- rgb: (79,150,216)

![#000000](https://placehold.it/15/000000/000000?text=+) **Background**

- hex: #000000
- rgb: (0,0,0)

#### Typography

![#FFFFFF](https://placehold.it/15/FFFFFF/000000?text=+) **Primary**

- hex: #FFFFFF
- rgb: (255,255,255)

![#121D59](https://placehold.it/15/A0D1FB/000000?text=+) **Secondary**

- hex: #A0D1FB
- rgb: (160,209,251)
  <br/>

# Theming Palette

Here is how we construct our Theme with MUI ([frontend/src/web/src/theme/index.ts](https://github.com/Seneca-CDOT/telescope/blob/master/src/web/src/theme/index.ts))

```ts
export const lightTheme: Theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#121D59',
    },
    secondary: {
      main: '#A0D1FB',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#E5E5E5',
    },
    text: {
      primary: '#000000',
      secondary: '#121D59',
    },
  },
});
```

## Usage Explanation

1. `primary.main` is used mainly for background color of any container that used the primary color
2. `secondary.main` is used for the background colour of scroll down and scroll to top buttons.
3. `error.main` is used for displaying error messages
4. `background.default` is used for the main background of the app as well as the content background of posts.
5. `text.primary` is used for the text color of posts' contents
6. `text.secondary` is used for the title of posts and header's icons
