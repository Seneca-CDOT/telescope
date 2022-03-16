import { useEffect } from 'react';
import { useLocalStorage, useMedia } from 'react-use';

/**
 * Combination of localStorage for remembering the user's preference between
 * loads of the app, and initial logic to get the browser's preferred colour.
 */
export default function usePreferredTheme() {
  const isDarkThemePreferred = useMedia('(prefers-color-scheme: dark)', false);
  const [preferredTheme, setPreferredTheme] = useLocalStorage(
    'preference:theme',
    isDarkThemePreferred ? 'dark' : 'light'
  );
  useEffect(() => {
    const lightStyleSheet = (document.querySelector('#light-stylesheet') as HTMLStyleElement).sheet;

    if (lightStyleSheet !== null) {
      lightStyleSheet.disabled = preferredTheme === 'dark';
    }

    const darkStyleSheet = (document.querySelector('#dark-stylesheet') as HTMLStyleElement).sheet;

    if (darkStyleSheet !== null) {
      darkStyleSheet.disabled = preferredTheme === 'light';
    }
  }, [preferredTheme]);

  return [preferredTheme, setPreferredTheme] as const;
}
