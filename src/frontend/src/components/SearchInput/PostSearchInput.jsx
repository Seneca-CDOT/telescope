import React from 'react';
import PropTypes from 'prop-types';

function PostSearchInput(props) {
  const { text, onChange, useStyles } = props;
  const classes = useStyles();
  return (
    <input
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      inputProps={{ 'aria-label': 'search telescope' }}
      value={text}
      onChange={onChange}
    />
  );
}

PostSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  useStyles: PropTypes.func,
};

export default PostSearchInput;
