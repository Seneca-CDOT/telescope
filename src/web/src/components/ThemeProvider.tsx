import { createContext, useContext } from 'react';
import { Theme } from '@material-ui/core/styles/createMuiTheme';

import { ThemeName } from '../interfaces';
import { lightTheme } from '../theme';

type ThemeContextType = {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeName: 'light',
  toggleTheme: () => console.warn('missing theme provider'),
});

export const useTheme = () => useContext(ThemeContext);
