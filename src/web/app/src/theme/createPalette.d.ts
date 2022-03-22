import { PaletteColorOptions, PaletteColor } from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    border?: PaletteColorOptions;
  }

  interface Palette {
    border: PaletteColor;
  }
}
