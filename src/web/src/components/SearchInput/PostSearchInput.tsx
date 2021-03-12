import { ChangeEvent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type PostSearchInputProps = {
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
      borderRadius: '7px',
      outline: 'none',
    },
  })
);

const PostSearchInput = ({ text, onChange }: PostSearchInputProps) => {
  const classes = useStyles();

  return (
    <>
      <input
        autoFocus
        className={classes.input}
        placeholder="How to contribute to Open Source"
        value={text}
        onChange={onChange}
      />
    </>
  );
};

export default PostSearchInput;
