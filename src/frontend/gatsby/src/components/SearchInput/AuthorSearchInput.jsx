import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, TextField } from '@material-ui/core';

function AuthorSearchInput({ text, onChange, classes }) {
  return (
    <>
      <FormControl fullWidth={true}>
        <TextField
          className={classes.input}
          variant="outlined"
          placeholder="How to Get Started in Open Source"
          value={text}
          onChange={onChange}
        ></TextField>
      </FormControl>
    </>
  );
}
AuthorSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  classes: PropTypes.object,
};
export default AuthorSearchInput;
