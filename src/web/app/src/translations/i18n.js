import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import TRANSLATIONS_ES from './es/translations';
import TRANSLATIONS_EN from './en/translations';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
      es: {
        translation: TRANSLATIONS_ES,
      },
    },
  });

// function to set the language for i18n
export const setLang = (language) => {
  i18n.changeLanguage(language);
};

// function to return the current language selected for i18n
export function getLang() {
  return i18n.language || 'en';
}
