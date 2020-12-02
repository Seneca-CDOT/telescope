/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';

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
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton
                type="submit"
                className={classes.iconButton}
                onClick={onSubmit}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <datalist id="search-suggestions" />
    </>
  );
}
AuthorSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  classes: PropTypes.object,
};
export default AuthorSearchInput;
