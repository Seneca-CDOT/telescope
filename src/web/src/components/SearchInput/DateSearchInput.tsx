import { Grid, TextField } from '@material-ui/core';
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
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  })
);

const DateSearchInput = () => {
  const classes = useStyles();
  const { from, to, onEndDateChange, onStartDateChange } = useSearchValue();
  return (
    <>
      {/* <input
        className={classes.input}
        placeholder={today}
        onChange={(event) => onTextChange(event.target.value)}
      /> */}
      <Grid item xs={12} sm={12}>
        <form className={classes.container} noValidate>
          <TextField
            id="fromDate"
            label="From"
            type="date"
            className={classes.input}
            InputLabelProps={{
              shrink: true,
            }}
            value={from}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
          <TextField
            id="toDate"
            label="To"
            type="date"
            className={classes.input}
            InputLabelProps={{
              shrink: true,
            }}
            value={to}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </form>
      </Grid>
    </>
  );
};

export default DateSearchInput;
