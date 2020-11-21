import React from 'react';
import PropTypes from 'prop-types';

function AuthorSearchInput({ text, onChange, classes }) {
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
  classes: PropTypes.object,
};

export default AuthorSearchInput;
