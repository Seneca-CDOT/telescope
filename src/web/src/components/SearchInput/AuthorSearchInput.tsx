import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useSearchValue from '../../hooks/use-search-value';

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
      width: '100%',

      height: '40px',
      backgroundColor: '#DBDBDB',
      paddingLeft: '10px',
      paddingRight: '60px',
      border: 'none',
      borderRadius: '7px',
      outline: 'solid black 1px',
      color: theme.palette.text.primary,
    },
  })
);
const AuthorSearchInput = () => {
  const classes = useStyles();
  const { author, onAuthorChange } = useSearchValue();

  return (
    <>
      <input
        className={classes.input}
        placeholder="David Smith"
        value={author}
        onChange={(event) => onAuthorChange(event.target.value)}
      />
    </>
  );
};

export default AuthorSearchInput;
