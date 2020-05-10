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
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 4, 2, 4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(2, 4, 2, 4),
    backgroundColor: '#335A7E',
    overflow: 'visible',
  },
  input: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    flex: 1,
    fontSize: '1.6rem',
    '& > *': {
      fontSize: '1.6rem !important',
    },
  },
  h2: {
    fontSize: '1.6rem',
    color: theme.palette.grey[200],
    marginTop: '1.75rem',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    transition: 'all linear 350ms',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '3rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '4rem',
    },
  },
  iconButton: {
    padding: 10,
    width: 58,
    height: 58,
    fontSize: '1.5rem',
    color: theme.palette.grey['100'],
    backgroundColor: theme.palette.secondary.light,

    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
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
    <Grid container spacing={0} alignItems="center" justify="center">
      <Grid item xs={4}>
        <Card className={classes.card} elevation={6}>
          <CardContent>
            <Typography variant="h2" className={classes.h2}>
              Search
            </Typography>
            <br />
            <Paper component="form" className={classes.root} elevation={0}>
              <FormControl>
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

              <TextField
                className={classes.input}
                placeholder="How to Get Started in Open Source"
                inputProps={{ 'aria-label': 'search telescope' }}
                variant="outlined"
                value={searchText}
                onChange={(event) => onTextChange(event)}
              />

              <IconButton
                type="submit"
                edge="end"
                onClick={(event) => onSubmit(event)}
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </CardContent>

          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              transition: 'all linear 350ms',
            }}
          ></CardActions>
        </Card>
      </Grid>
    </Grid>
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
