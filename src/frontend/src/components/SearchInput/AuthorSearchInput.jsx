import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

function AuthorSearchInput({ text, onChange, classes, IconButton, onSubmit }) {
  return (
    <>
      <input
        className={classes.input}
        list="search-suggestions"
        placeholder="How to Get Started in Open Source"
        inputProps={{ 'aria-label': 'search telescope' }}
        value={text}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton type="submit" className={classes.iconButton} onClick={onSubmit}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
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
  IconButton: PropTypes.func,
  onSubmit: PropTypes.object,
};

export default AuthorSearchInput;
