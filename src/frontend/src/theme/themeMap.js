import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

const themeMap = {
  lightTheme,
  darkTheme,
};

function getThemeByBool(isDark) {
  let theme = 'lightTheme';

  if (isDark) {
    theme = 'darkTheme';
  }

  return themeMap[theme];
}

export default getThemeByBool;
