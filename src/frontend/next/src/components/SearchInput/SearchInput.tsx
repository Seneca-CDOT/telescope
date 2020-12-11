import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PostSearchInput from './PostSearchInput';
import AuthorSearchInput from './AuthorSearchInput';

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '1.6rem',
    '&:hover': {
      border: '1px solid',
      borderColor: theme.palette.primary.main,
    },
    '&:focus': {
      border: '2px solid',
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      fontSize: '1.6rem !important',
      color: theme.palette.text.primary,
    },
    height: '55px',
    backgroundColor: theme.palette.background.default,
    paddingLeft: '10px',
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
    outline: 'none',
  },
}));
interface SearchInputProps {
  text?: string;
  onChange: (event?: any) => void;
  filter?: string;
}

function SearchInput({ text, filter, onChange }: SearchInputProps) {
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

export default SearchInput;
