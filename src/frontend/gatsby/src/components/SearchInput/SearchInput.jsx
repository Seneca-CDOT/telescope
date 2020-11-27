import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PostSearchInput from './PostSearchInput.jsx';
import AuthorSearchInput from './AuthorSearchInput.jsx';

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '1.6rem',
    '&:hover': {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
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
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
    outline: 'none',
  },
}));

function SearchInput({ text, filter, onChange }) {
  const classes = useStyles();
  return filter === 'author' ? (
    <AuthorSearchInput
      classes={classes}
      text={text}
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <PostSearchInput
      classes={classes}
      text={text}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

SearchInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func,
  filter: PropTypes.string,
};

export default SearchInput;
