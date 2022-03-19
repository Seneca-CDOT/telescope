// Shouldn't produce errors but this component needs more care
// Look into other Select examples https://mui.com/components/selects/#basic-select
import { createContext, useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@mui/styles';

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

const useStyles = makeStyles(() => {
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

  const changeLanguage = (e: SelectChangeEvent) => {
    setLanguage(e.target.value as string);
    setLang(e.target.value);
  };

  return (
    <Box sx={{ minwidth: 120 }}>
      <FormControl>
        <InputLabel id="language-label">Language</InputLabel>
        <Select
          className={classes.selectBox}
          labelId="language-label"
          id="language-select"
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
    </Box>
  );
};

export default LanguageSelector;
