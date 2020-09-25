import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';

import {
  Grid,
  MenuItem,
  TextField,
  FormControl,
  Paper,
  IconButton,
  Container,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'visible',
    maxWidth: '785px',
    padding: 0,
  },
  card: {
    padding: theme.spacing(2, 4, 2, 4),
  },
  input: {
    fontSize: '1.6rem',
    '& > *': {
      fontSize: '1.6rem !important',
    },
  },
  header: {
    padding: 0,
    marginBottom: theme.spacing(2),
    backgroundColor: '#335A7E',
  },
  h1: {
    background: 'transparent',
    display: 'block',
    boxShadow: 'none',
    marginTop: '1.75rem',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    transition: 'all linear 350ms',
    fontWeight: 600,
    color: '#97d5ff',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '5rem',
    },
  },
  iconButton: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    color: theme.palette.grey['100'],
    backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
    '& * > .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  },

  selectControl: {
    '& > *': {
      fontSize: '1.4rem',
      textTransform: 'capitalize',
    },
  },
  selectItem: {
    fontSize: '1.2rem',
    textTransform: 'capitalize',
  },
}));

function CustomizedInputBase(props) {
  const classes = useStyles();
  const { searchText, onChangeHandler, onFilterChangeHandler, filter, onFormSubmit } = props;

  const onFilterChange = (event) => {
    onFilterChangeHandler(event.target.value);
  };

  const onTextChange = (event) => {
    onChangeHandler(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onFormSubmit();
  };

  const searchOptions = ['post', 'author'];

  return (
    <Container className={classes.root}>
      <Paper component="form" className={classes.card} elevation={0}>
        <Grid
          container
          className={classes.header}
          direction="row"
          spacing={8}
          alignItems="center"
          justify="baseline"
        >
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.h1}>
              Search
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2} alignItems="center" justify="baseline">
          <Grid item xs={3} lg={2}>
            <FormControl fullWidth={true}>
              <TextField
                id="standard-select-search-type"
                select
                label="Filter"
                value={filter}
                variant="outlined"
                className={classes.selectControl}
                onChange={(event) => onFilterChange(event)}
              >
                {searchOptions.map((option) => (
                  <MenuItem key={option} value={option} className={classes.selectItem}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={9} lg={10}>
            <FormControl fullWidth={true}>
              <TextField
                className={classes.input}
                placeholder="How to Get Started in Open Source"
                inputProps={{ 'aria-label': 'search telescope' }}
                variant="outlined"
                value={searchText}
                onChange={(event) => onTextChange(event)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={10} sm={11}>
            {/* Spacer trick to align to end */}
          </Grid>
          <Grid item xs={1}>
            <FormControl>
              <IconButton
                type="submit"
                onClick={(event) => onSubmit(event)}
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

CustomizedInputBase.propTypes = {
  searchText: PropTypes.string,
  onChangeHandler: PropTypes.func,
  onFilterChangeHandler: PropTypes.func,
  onFormSubmit: PropTypes.func,
  filter: PropTypes.string,
};
export default CustomizedInputBase;
