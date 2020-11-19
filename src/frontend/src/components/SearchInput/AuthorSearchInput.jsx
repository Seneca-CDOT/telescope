import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import PropTypes from 'prop-types';

function AuthorSearchInput(props) {
  const { text, onChange, useStyles } = props;
=======
import { makeStyles } from '@material-ui/core/styles';
=======
>>>>>>> Removed outline for input style/ moved style class to SearchInput
import PropTypes from 'prop-types';

function AuthorSearchInput(props) {
<<<<<<< HEAD
  const { text, onChange } = props;
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
=======
  const { text, onChange, useStyles } = props;
>>>>>>> Removed outline for input style/ moved style class to SearchInput
  const classes = useStyles();
  return (
    <>
      <input
<<<<<<< HEAD
<<<<<<< HEAD
        className={classes.input}
        list="search-suggestions"
=======
        list="search-suggestions"
        className={classes.input}
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
=======
        className={classes.input}
        list="search-suggestions"
>>>>>>> Removed outline for input style/ moved style class to SearchInput
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
<<<<<<< HEAD
  useStyles: PropTypes.func,
=======
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
=======
  useStyles: PropTypes.func,
>>>>>>> Removed outline for input style/ moved style class to SearchInput
};

export default AuthorSearchInput;
