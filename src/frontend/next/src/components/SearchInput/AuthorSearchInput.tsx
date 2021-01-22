import { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type AuthorSearchInputProps = {
  text: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '1.6rem',
    '&:hover': {
      border: '1px solid',
      borderColor: theme.palette.primary.main,
    },
    '&:focus': {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      fontSize: '1.6rem !important',
      color: theme.palette.text.primary,
    },
    height: '55px',
    backgroundColor: theme.palette.background.default,
    paddingLeft: '10px',
    paddingRight: '60px',
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
    outline: 'none',
  },
}));

const AuthorSearchInput = ({ text, onChange }: AuthorSearchInputProps) => {
  const classes = useStyles();

  return (
    <>
      <input
        className={classes.input}
        list="search-suggestions"
        placeholder="How to Get Started in Open Source"
        value={text}
        onChange={onChange}
      />

      <datalist aria-label="search telescope" id="search-suggestions" />
    </>
  );
};

export default AuthorSearchInput;
