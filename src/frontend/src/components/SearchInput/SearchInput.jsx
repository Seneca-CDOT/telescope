import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import { makeStyles } from '@material-ui/core/styles';
import PostSearchInput from './PostSearchInput.jsx';
import AuthorSearchInput from './AuthorSearchInput.jsx';

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
    border: '1px solid #B3B6B7',
    borderRadius: '7px',
    outline: 'none',
  },
}));

function SearchInput(props) {
  const { text, filter, onChange } = props;
  return filter === 'author' ? (
    <AuthorSearchInput
      useStyles={useStyles}
      value={text}
<<<<<<< HEAD
=======
      filter={filter}
>>>>>>> Switched onTextChange to onChange
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <PostSearchInput
      useStyles={useStyles}
      value={text}
<<<<<<< HEAD
=======
      filter={filter}
>>>>>>> Switched onTextChange to onChange
      onChange={(event) => onChange(event.target.value)}
    />
=======
import PostSearchInput from './PostSearchInput.jsx';
import AuthorSearchInput from './AuthorSearchInput.jsx';

function SearchInput(props) {
  const { text, filter, onChange } = props;
  return filter === 'author' ? (
    <AuthorSearchInput value={text} onChange={(event) => onChange(event.target.value)} />
  ) : (
    <PostSearchInput value={text} onChange={(event) => onChange(event.target.value)} />
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
  );
}

SearchInput.propTypes = {
  text: PropTypes.string,
<<<<<<< HEAD
=======
  onChange: PropTypes.func,
  filter: PropTypes.string,
};

<<<<<<< HEAD
AuthorSearchInput.propTypes = {
  text: PropTypes.string,
>>>>>>> Switched onTextChange to onChange
  onChange: PropTypes.func,
  filter: PropTypes.string,
};

=======
>>>>>>> Moved both AuthorSearchInput and PostSearchInput to there own files
export default SearchInput;
