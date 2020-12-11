import React from 'react';
import PropTypes from 'prop-types';

function PostSearchInput({ text, onChange, classes }: any) {
  return (
    <input
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      // inputProps={{ 'aria-label': 'search telescope' }}
      aria-label="search telescope"
      value={text}
      onChange={onChange}
    />
  );
}

PostSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  classes: PropTypes.object,
};

export default PostSearchInput;
