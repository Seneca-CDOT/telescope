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

const DateSearchInput = () => {
  const classes = useStyles();
  const { onTextChange } = useSearchValue();
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <input
        className={classes.input}
        placeholder={today}
        onChange={(event) => onTextChange(event.target.value)}
      />
    </>
  );
};

export default DateSearchInput;
