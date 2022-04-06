import { TextField } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Autocomplete } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { searchServiceUrl } from '../../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      fontSize: '1.2rem',
      color: theme.palette.text.primary,
      borderRadius: `4rem`,
      borderColor: theme.palette.info.main,
      borderWidth: `2px`,
    },
    listbox: {
      fontSize: '1.2rem',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      '& :hover': {
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.default,
        border: '2px solid',
      },
    },
  })
);

const fetchResults = async (url: string | null) => {
  if (url) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const results = await res.json();
        // return up to first 10 results
        return results.res.slice(0, 10);
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return [];
};

interface AuthorInputInterface {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  labelFor: string;
}

const AuthorInput = ({ text, setText, labelFor }: AuthorInputInterface) => {
  const cs = useStyles();
  const [options, setOptions] = useState<[{ author: string; highlight: string }]>();

  useEffect(() => {
    // debounce so it searches every 0.5 seconds, instead of on every stroke
    const debounce = setTimeout(() => {
      (async () => {
        const prepareUrl = () => `${searchServiceUrl}/authors/autocomplete/?author=${text}`;
        // Do the request if there is something to search for
        const shouldFetch = () => text.length > 0;
        const data = await fetchResults(shouldFetch() ? prepareUrl() : null);
        if (data) {
          setOptions(data);
        }
      })();
    }, 500);

    return () => clearTimeout(debounce);
  }, [text]);

  // mui Autocomplete component https://mui.com/components/autocomplete/
  return (
    <Autocomplete
      id="author-autocomplete"
      freeSolo
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.author)}
      options={options || []}
      // disable built-in filtering for search as you type
      // https://mui.com/components/autocomplete/#search-as-you-type
      filterOptions={(x) => x}
      value={text}
      onInputChange={(_event, newInputValue) => {
        setText(newInputValue);
      }}
      fullWidth
      classes={{
        listbox: cs.listbox,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="medium"
          fullWidth
          label={labelFor}
          InputProps={{
            ...params.InputProps,
            type: 'search',
            classes: {
              root: cs.input,
              focused: cs.input,
              notchedOutline: cs.input,
            },
          }}
          InputLabelProps={{
            classes: {
              root: cs.input,
              focused: cs.input,
            },
          }}
        />
      )}
    />
  );
};

export default AuthorInput;
