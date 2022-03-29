import { Dispatch, SetStateAction } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

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
      borderRadius: '7px',
      outline: 'none',
      color: theme.palette.text.primary,
    },
  })
);

interface SearchInputInterface {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

const SearchInput = ({ text, setText }: SearchInputInterface) => {
  const classes = useStyles();

  return (
    <>
      <input
        className={classes.input}
        placeholder="How to contribute to Open Source"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </>
  );
};

export default SearchInput;
