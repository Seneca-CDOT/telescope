import React from 'react';
<<<<<<< HEAD
import PropTypes from 'prop-types';

function AuthorSearchInput(props) {
  const { text, onChange, useStyles } = props;
=======
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '1.6rem',
    '&:hover': {
      border: '2px solid',
      borderColor: theme.palette.background.default,
    },
    '&:focus': {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      fontSize: '1.6rem !important',
      color: theme.palette.text.default,
    },
    height: '55px',
    backgroundColor: theme.palette.background.default,
    paddingLeft: '10px',
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
  },
}));

function AuthorSearchInput(props) {
  const { text, onChange } = props;
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
  const classes = useStyles();
  return (
    <>
      <input
<<<<<<< HEAD
        className={classes.input}
        list="search-suggestions"
=======
        list="search-suggestions"
        className={classes.input}
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
        placeholder="How to Get Started in Open Source"
        inputProps={{ 'aria-label': 'search telescope' }}
        value={text}
        onChange={onChange}
      />
      <datalist id="search-suggestions"></datalist>
    </>
  );
}

AuthorSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
<<<<<<< HEAD
  useStyles: PropTypes.func,
=======
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
};

export default AuthorSearchInput;
