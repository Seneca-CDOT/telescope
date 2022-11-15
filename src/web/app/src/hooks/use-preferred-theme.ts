import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import {
  ThemeName,
  LIGHT_DEFAULT,
  LIGHT_HIGH_CONTRAST,
  DARK_DEFAULT,
  DARK_DIM,
} from '../interfaces/index';

/**
 * Combination of localStorage for remembering the user's preference between
 * loads of the app, and initial logic to get the browser's preferred colour.
 */
export default function usePreferredTheme() {
  const [preferredTheme, setPreferredTheme] = useLocalStorage<ThemeName>(
    'preference:theme',
    LIGHT_DEFAULT
  );
  useEffect(() => {
    const lightStyleSheet = (document.querySelector('#light-stylesheet') as HTMLStyleElement).sheet;

    if (lightStyleSheet !== null) {
      lightStyleSheet.disabled = preferredTheme === (DARK_DEFAULT || DARK_DIM);
    }

    const darkStyleSheet = (document.querySelector('#dark-stylesheet') as HTMLStyleElement).sheet;

    if (darkStyleSheet !== null) {
      darkStyleSheet.disabled = preferredTheme === (LIGHT_DEFAULT || LIGHT_HIGH_CONTRAST);
    }
  }, [preferredTheme]);

  return [preferredTheme, setPreferredTheme] as const;
}
