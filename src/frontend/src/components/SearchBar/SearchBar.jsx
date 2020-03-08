import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const SEARCH_QUERY = gql`
  query testQuery {
    getPosts(page: 0, perPage: 5) {
      title
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    color: theme.palette.text.secondary,
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    width: 500,
    backgroundColor: '#3670A5',
  },
  input: {
    flex: 1,
    padding: 7,
    backgroundColor: '#9E9E9E',
    fontSize: 14,
  },
  iconButton: {
    color: '#002944',
    backgroundColor: '#3670A5',
  },
  formControl: {
    minWidth: 80,
    padding: 7,
    backgroundColor: '#3670A5',
  },
  selectEmpty: {
    fontSize: 14,
  },
}));

function CustomizedInputBase() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    filter: '',
  });
  const [results, setResults] = React.useState([]);

  const handleChange = filter => event => {
    setState({
      ...state,
      [filter]: event.target.value,
    });
  };

  const [getResults, { loading, error, data }] = useLazyQuery(SEARCH_QUERY);
  if (error) console.log('error!');
  if (!loading && data) {
    const res = data.getPosts;
    res.forEach(element => console.log(element));
    // setResults(data.getPosts);
  }

  function handleOnClick(event) {
    event.preventDefault();
    getResults();
  }

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.paper}>
        <FormControl className={classes.formControl}>
          <NativeSelect
            disableUnderline
            value={state.filter}
            onChange={handleChange('filter')}
            name="filter"
            className={classes.selectEmpty}
            inputProps={{ 'aria-label': 'filter' }}
          >
            <option value="">None</option>
            <option value="author">Author</option>
            <option value="filter2">Filter2</option>
            <option value="filter3">Filter3</option>
          </NativeSelect>
        </FormControl>
        <InputBase
          className={classes.input}
          placeholder="Search Telescope"
          inputProps={{ 'aria-label': 'search telescope' }}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={event => handleOnClick(event)}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
}

export default CustomizedInputBase;
