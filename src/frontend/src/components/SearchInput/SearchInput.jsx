import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '1.6rem',
    '&:hover': {
      border: '2px solid',
      borderColor: theme.palette.background.default,
    },
    '&:focus': {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      fontSize: '1.6rem !important',
      color: theme.palette.text.default,
    },
    height: '55px',
    backgroundColor: theme.palette.background.default,
    paddingLeft: '10px',
    // The border around some of the inputs was a default of the type so I had to add my own
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
  },
}));

function AuthorSearchInput(props) {
  const classes = useStyles();
  const { searchText, onChangeHandler } = props;

  const onTextChange = (event) => {
    onChangeHandler(event.target.value);
  };

  return (
    <>
      <input
        // ...rest of props here
        type="text"
        id="authorSearch"
        className={classes.input}
        placeholder="How to Get Started in Open Source"
        variant="outlined"
        list="searchData"
        value={searchText}
        onChange={(event) => onTextChange(event)}
        inputProps={{ 'aria-label': 'search telescope' }}
      />
      <datalist id="searchData">
        <option>Test 1</option>
        <option>Test 2</option>
        <option>Test 3</option>
      </datalist>
    </>
  );
}

function PostSearchInput(props) {
  const classes = useStyles();
  const { searchText, onChangeHandler } = props;

  const onTextChange = (event) => {
    onChangeHandler(event.target.value);
  };

  return (
    <input
      type="text"
      id="postSearch"
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      variant="outlined"
      value={searchText}
      onChange={(event) => onTextChange(event)}
      inputProps={{ 'aria-label': 'search telescope' }}
    />
  );
}

function SearchInput({ filter }) {
  return filter === 'author' ? <AuthorSearchInput /> : <PostSearchInput />;
}

PostSearchInput.propTypes = {
  searchText: PropTypes.string,
  onChangeHandler: PropTypes.func,
};

AuthorSearchInput.propTypes = {
  searchText: PropTypes.string,
  onChangeHandler: PropTypes.func,
};
export default SearchInput;
