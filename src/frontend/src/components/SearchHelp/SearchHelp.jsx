import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { IconButton, Typography, Fab, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  infoButton: {
    marginTop: '7.5px',
    marginLeft: '-25px',
    fontSize: '3rem',
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

function SearchHelp(props) {
  const classes = useStyles();
  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography variant="h5">How to use search</Typography>
          <ul>
            <li>
              <b>{"' + '"}</b>
              {' signifies AND operator'}
            </li>
            <li>
              <b>{"' | '"}</b>
              {' signifies OR operator'}
            </li>
            <li>
              <b>{"' - '"}</b>
              {' negates a single token'}
            </li>
            <li>
              <b>{"' \" '"}</b>
              {' wraps a number of tokens to signify a phrase for searching'}
            </li>
            <li>
              <b>{"' * '"}</b>
              {' at the end of a term signifies a prefix query'}
            </li>
            <li>
              <b>{"' ( ' and ' ) '"}</b>
              {' signify precendence '}
            </li>
            <li>
              <b>{"' ~N '"}</b>
              {' after a word signifies edit distance (fuzziness)'}
            </li>
            <li>
              <b>{"' ~N '"}</b>
              {' after a phrase signifies slop amount'}
            </li>
          </ul>
        </React.Fragment>
      }
    >
      <InfoOutlinedIcon className={classes.infoButton} />
    </HtmlTooltip>
  );
}

export default SearchHelp;
