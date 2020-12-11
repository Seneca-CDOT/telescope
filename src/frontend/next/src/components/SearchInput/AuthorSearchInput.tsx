import React from 'react';

interface SearchInput {
  text: string;
  onChange: () => void;
  classes: {
    input: string;
  };
}

function AuthorSearchInput({ text, onChange, classes }: SearchInput) {
  return (
    <>
      <input
        className={classes.input}
        list="search-suggestions"
        placeholder="How to Get Started in Open Source"
        // inputProps={{ 'aria-label': 'search telescope' }}
        aria-label="search telescope"
        value={text}
        onChange={onChange}
      />
      <datalist id="search-suggestions" />
    </>
  );
}
export default AuthorSearchInput;
