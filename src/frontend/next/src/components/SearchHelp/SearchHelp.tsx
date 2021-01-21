import { withStyles, makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { Typography, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  infoButton: {
    marginTop: '7.5px',
    marginLeft: '-25px',
    fontSize: '3rem',
    color: '#8BC2EB',
  },
}));

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(22.5),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

const SearchHelp = () => {
  const classes = useStyles();
  return (
    <HtmlTooltip
      title={
        <>
          <Typography variant="h5">How to use search</Typography>
          <ul>
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
        </>
      }
    >
      <InfoOutlinedIcon className={classes.infoButton} />
    </HtmlTooltip>
  );
};

export default SearchHelp;
