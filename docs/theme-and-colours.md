# Colour Palette

Thank you for thinking to contribute to the look of the Telescope. This is a guide to the colour palette that we use to make our web site looks pretty and up-to-date.

![Palette](images/palette.png)

## Palette

![#333E64](https://placehold.it/15/333E64/000000?text=+) **Primary**

- hex: #333E64
- rgb: (51, 62, 100)

![#0589D6](https://placehold.it/15/0589D6/000000?text=+) **Secondary**

- hex: #0589D6
- rgb: (5, 137, 214)

![#E5E5E5](https://placehold.it/15/E5E5E5/000000?text=+) **Background**

- hex: #E5E5E5
- rgb: (229, 229, 229)

## Typography

![#181818](https://placehold.it/15/181818/000000?text=+) **Primary**

- hex: #181818
- rgb: (24, 24, 24)

![#8BC2EB](https://placehold.it/15/8BC2EB/000000?text=+) **Secondary**

- hex: #8BC2EB
- rgb: (139, 194, 235)

![#E5E5E5](https://placehold.it/15/E5E5E5/000000?text=+) **Contrast Text**

- hex: #E5E5E5
- rgb: (229, 229, 229)

“The Free Image Placeholder Service Favoured By Designers.” Placeholder.com, 17 Dec. 2019, placeholder.com/.

<br/>

# Theming

Here is how we construct our Theme with MUI ([frontend/src/theme.js](https://github.com/Seneca-CDOT/telescope/blob/master/docs/theme-and-colours.md))

```node
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333E64',
      contrastText: '#E5E5E5',
    },
    secondary: {
      main: '#0589D6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#E5E5E5',
    },
    text: {
      primary: '#181818',
      secondary: '#8BC2EB',
    },
  },
});
```

## Usage Explanation

1. `primary.main` is used mainly for background color of header, footer, posts' header, banner and search bar's heading
2. `primary.contrastText` is used where we need contrast text on top of `primary.main` color. These include text in header, footer, banner, and text in posts' header about date and author.
3. `secondary.main` is used for the background colour of scroll down and scroll to top buttons.
4. `error.main` is used for displaying error messages
5. `background.default` is used for the main background of the app as well as the content background of posts.
6. `text.primary` is used for the text color of posts' contents and about information text
7. `text.secondary` is used for the title of posts
