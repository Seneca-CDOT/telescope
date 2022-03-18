import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    border: PaletteColor;
  }

  interface PaletteOptions {
    border?: PaletteColorOptions;
  }
}
