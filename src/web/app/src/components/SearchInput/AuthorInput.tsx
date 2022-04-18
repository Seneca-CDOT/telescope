import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@mui/material';
import TextField from '@material-ui/core/TextField';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { searchServiceUrl } from '../../config';

type AutocompleteStyleProps = {
  isListOpen: boolean;
};

const useStyles = makeStyles<Theme, AutocompleteStyleProps>((theme) =>
  createStyles({
    input: {
      fontSize: '1.4rem',
      color: theme.palette.text.primary,
      borderRadius: ({ isListOpen }) => (isListOpen ? '2rem 2rem 0 0' : '4rem'),
      borderColor: theme.palette.info.main,
      borderWidth: '2px',
      padding: '1rem !important',
      '&:hover fieldset': {
        borderColor: `${theme.palette.info.main} !important`,
      },
      '&.Mui-focused fieldset': {
        borderColor: `${theme.palette.info.main} !important`,
      },
      '& fieldset': {
        borderColor: theme.palette.info.main,
        borderWidth: '2px',
        borderBottom: ({ isListOpen }) =>
          isListOpen ? `none` : `2px solid ${theme.palette.info.main}`,
      },
    },
    label: {
      color: `${theme.palette.text.secondary} !important`,
      fontSize: '1.4rem',
    },
    popper: {
      boxSizing: 'border-box',
      borderWidth: '1px 2px 2px',
      borderColor: ({ isListOpen }) => (isListOpen ? theme.palette.info.main : 'transparent'),
      borderStyle: 'solid',

      overflow: 'hidden',
      borderRadius: '0 0 2rem 2rem',
      '& > div': {
        backgroundColor: theme.palette.background.default,
        borderRadius: 0,
      },
    },
    listbox: {
      color: theme.palette.text.primary,
      borderRadius: 0,
      fontFamily: 'inherit',
      fontSize: '1.4rem',
    },
    clear: {
      color: theme.palette.text.primary,
      '& svg': {
        fontSize: '2rem',
      },
    },
    option: {
      borderRadius: '3px',
      '&.Mui-focused': {
        backgroundColor: `${theme.palette.background.paper} !important`,
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
  const [isListOpen, setIsListOpen] = useState(false);
  const [options, setOptions] = useState<[{ author: string; highlight: string }]>();
  const cs = useStyles({
    isListOpen: isListOpen && !!options?.length,
  });

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

  return (
    <Autocomplete
      id="author-autocomplete"
      freeSolo
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.author)}
      options={options || []}
      onOpen={() => setIsListOpen(true)}
      onClose={() => setIsListOpen(false)}
      open={isListOpen}
      // disable built-in filtering for search as you type
      // https://mui.com/components/autocomplete/#search-as-you-type
      filterOptions={(x) => x}
      value={text}
      onInputChange={(_event, newInputValue) => {
        setText(newInputValue);
      }}
      fullWidth
      clearIcon={<CloseIcon fontSize="medium" className={cs.clear} />}
      classes={{
        popper: cs.popper,
        listbox: cs.listbox,
        endAdornment: cs.clear,
        option: cs.option,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="medium"
          fullWidth
          color="primary"
          label={labelFor}
          InputProps={{
            ...params.InputProps,
            type: 'text',
            classes: {
              root: cs.input,
              focused: cs.input,
            },
          }}
          InputLabelProps={{
            classes: {
              root: cs.label,
              focused: cs.label,
            },
          }}
        />
      )}
    />
  );
};

export default AuthorInput;
