import { createContext, ChangeEvent, useState } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { setLang, getLang } from '../translations/i18n';

export interface TranslationInterface {
  currentLanguage: string;
}

export const translationInterface = createContext<TranslationInterface>({
  currentLanguage: 'en',
});

const languages: Array<{ name: string; code: string }> = [
  { name: 'English', code: 'en' },
  { name: 'Español', code: 'es' },
];

const useStyles = makeStyles((theme) => {
  return {
    selectBox: {
      width: '10rem',
      fontFamily: 'sans-serif',
    },
  };
});

const LanguageSelector = () => {
  const classes = useStyles();

  // sets the state to use the current i18 language. i18 remembers the language for the page,
  // and is not effected by rendering.
  const [language, setLanguage] = useState(getLang());

  const changeLanguage = (
    e: ChangeEvent<{ name?: string | undefined; value: string | unknown }>
  ) => {
    e.preventDefault();
    setLanguage(e.target.value as string);
    setLang(e.target.value);
  };

  return (
    <Grid container>
      <FormControl>
        <InputLabel>Language</InputLabel>
        <Select
          className={classes.selectBox}
          value={language}
          label="Language"
          onChange={changeLanguage}
        >
          {languages.map((lang) => {
            return (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default LanguageSelector;
