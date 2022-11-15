import { createContext, useContext } from 'react';
import { Theme } from '@material-ui/core/styles';
import { lightTheme } from '../theme';
import { ThemeName, LIGHT_DEFAULT } from '../interfaces/index';

type ThemeContextType = {
  theme: Theme;
  preferredTheme?: ThemeName;
  changeTheme: (themeId: ThemeName) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  preferredTheme: LIGHT_DEFAULT,
  changeTheme: () => console.warn('missing change theme provider'),
});

export const useTheme = () => useContext(ThemeContext);
