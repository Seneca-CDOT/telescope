import React from 'react';
import PropTypes from 'prop-types';

function AuthorSearchInput(props) {
  const { text, onChange, useStyles } = props;
  const classes = useStyles();
  return (
    <>
      <input
        className={classes.input}
        list="search-suggestions"
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
  useStyles: PropTypes.func,
};

export default AuthorSearchInput;
