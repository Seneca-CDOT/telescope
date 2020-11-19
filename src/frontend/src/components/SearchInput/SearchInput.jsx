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
    // The border around the textField inputs was a default of the type so I had to add my own
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
  },
}));

function AuthorSearchInput(props) {
  const { text, onChange, filter } = props;
  const classes = useStyles();
  return (
    <>
      <input
        list="searchData"
        className={classes.input}
        placeholder="How to Get Started in Open Source"
        inputProps={{ 'aria-label': 'search telescope' }}
        value={text}
        onChange={onChange}
        filter={filter}
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
  const { text, onChange, filter } = props;
  const classes = useStyles();
  return (
    <input
      className={classes.input}
      placeholder="How to Get Started in Open Source"
      inputProps={{ 'aria-label': 'search telescope' }}
      value={text}
      onChange={onChange}
      filter={filter}
    />
  );
}

function SearchInput(props) {
  const { text, filter, onTextChange } = props;
  return filter === 'author' ? (
    <AuthorSearchInput
      value={text}
      filter={filter}
      onChange={(event) => onTextChange(event.target.value)}
    />
  ) : (
    <PostSearchInput
      value={text}
      filter={filter}
      onChange={(event) => onTextChange(event.target.value)}
    />
  );
}

SearchInput.propTypes = {
  text: PropTypes.string,
  onTextChange: PropTypes.func,
  filter: PropTypes.string,
};

AuthorSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  filter: PropTypes.string,
};

PostSearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  filter: PropTypes.string,
};
export default SearchInput;
