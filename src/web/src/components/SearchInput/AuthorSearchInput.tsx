import { ChangeEvent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type AuthorSearchInputProps = {
  text: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      fontSize: '1.6rem',
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
      '&:focus': {
        borderColor: theme.palette.primary.main,
      },
      '& > *': {
        fontSize: '1.6rem !important',
        color: theme.palette.text.primary,
      },
      height: '55px',
      backgroundColor: 'transparent',
      paddingLeft: '10px',
      paddingRight: '60px',
      border: 'none',
      outline: 'none',
      color: theme.palette.text.primary,
    },
  })
);

const AuthorSearchInput = ({ text, onChange }: AuthorSearchInputProps) => {
  const classes = useStyles();

  return (
    <>
      <input
        autoFocus
        className={classes.input}
        list="search-suggestions"
        placeholder="How to contribute to Open Source"
        value={text}
        onChange={onChange}
      />

      <datalist aria-label="search telescope" id="search-suggestions" />
    </>
  );
};

export default AuthorSearchInput;
