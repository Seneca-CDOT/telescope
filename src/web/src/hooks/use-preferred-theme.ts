import { useLocalStorage, useMedia } from 'react-use';

/**
 * Combination of localStorage for remembering the user's preference between
 * loads of the app, and initial logic to get the browser's preferred colour.
 */
export default function usePreferredTheme() {
  const isDarkThemePreferred = useMedia('(prefers-color-scheme: dark)');
  const [preferredTheme, setPreferredTheme] = useLocalStorage(
    'preference:theme',
    isDarkThemePreferred ? 'dark' : 'light'
  );

  return [preferredTheme, setPreferredTheme] as const;
}
