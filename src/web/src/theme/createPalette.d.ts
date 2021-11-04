import * as createPalette from '@material-ui/core/styles/createPalettes';

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    border?: PaletteColorOptions;
  }

  interface Palette {
    border: PaletteColor;
  }
}
