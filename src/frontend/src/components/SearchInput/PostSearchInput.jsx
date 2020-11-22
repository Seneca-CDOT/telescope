import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

function PostSearchInput({ text, onChange, classes, IconButton }) {
  return (
    <input
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      inputProps={{ 'aria-label': 'search telescope' }}
      value={text}
      InputProps={{
        endAdornment: (
          <InputAdornment>
            <IconButton type="submit" className={classes.iconButton}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={onChange.value}
    />
  );
}

PostSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  classes: PropTypes.object,
  IconButton: PropTypes.func,
};

export default PostSearchInput;
