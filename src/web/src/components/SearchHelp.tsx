import { makeStyles } from '@material-ui/core/styles';
import { Typography, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflow: 'visible',
    maxWidth: '785px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 0,
  },
  title: {
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
    paddingBottom: '1.5rem',
  },
  list: {
    fontFamily: 'Times New Roman',
    fontSize: '1.7rem',
    lineHeight: '3rem',
    color: theme.palette.text.primary,
    listStyleType: 'none',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingTop: 0,
      paddingBottom: theme.spacing(6),
      lineHeight: '2.5rem',
    },
  },
}));

const SearchHelp = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        <Typography className={classes.title} variant="h5">
          HOW TO USE SEARCH:
        </Typography>
        <li>
          <b>&apos; + &apos;</b>
          {' signifies AND operator'}
        </li>
        <li>
          <b>&apos; | &apos;</b>
          {' signifies OR operator'}
        </li>
        <li>
          <b>&apos; - &apos;</b>
          {' negates a single token'}
        </li>
        <li>
          <b>&ldquo; &rdquo;</b>
          {' wraps a number of tokens to signify a phrase for searching'}
        </li>
        <li>
          <b>&apos; * &apos;</b>
          {' at the end of a term signifies a prefix query'}
        </li>
        <li>
          <b>&apos; ( &apos; and &apos; ) &apos;</b>
          {' signify precendence '}
        </li>
        <li>
          <b>&apos; ~N &apos;</b>
          {' after a word signifies edit distance (fuzziness)'}
        </li>
        <li>
          <b>&apos; ~N &apos;</b>
          {' after a phrase signifies slop amount'}
        </li>
      </ul>
    </div>
  );
};

export default SearchHelp;
