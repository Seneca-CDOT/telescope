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
  Box,
  Typography,
  Fab,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'visible',
    maxWidth: '785px',
    padding: 0,
    marginTop: '10rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(6),
  },
  card: {
    padding: theme.spacing(2, 4, 2, 4),
    backgroundColor: theme.palette.background.default,
  },
  input: {
    fontSize: '1.6rem',
    '& > *': {
      fontSize: '1.6rem !important',
      color: theme.palette.text.default,
    },
  },
  header: {
    padding: 0,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  },
  h1: {
    display: 'block',
    transition: 'all linear 350ms',
    fontWeight: 600,
    color: theme.palette.text.secondary,
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
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
    '& * > .MuiSvgIcon-root': {
      fontSize: '2rem',
      color: theme.palette.text.primary,
    },
    margin: 0,
    position: 'relative',
    bottom: theme.spacing(-2),
    float: 'right',
    marginBottom: theme.spacing(-5.5),
  },

  selectControl: {
    '& > *': {
      fontSize: '1.2rem',
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
    },
  },
  selectItem: {
    fontSize: '1.4rem',
    textTransform: 'capitalize',
    color: theme.palette.primary.main,
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
    <Box className={classes.root} boxShadow={2}>
      <Paper component="form" className={classes.card} elevation={0}>
        <Grid
          container
          className={classes.header}
          direction="row"
          spacing={8}
          alignItems="center"
          justify="flex-start"
        >
          <Grid item xs={12}>
            <Typography variant="h1" className={classes.h1}>
              Search
            </Typography>
          </Grid>
        </Grid>
        <Fab size="large" className={classes.iconButton}>
          <FormControl>
            <IconButton type="submit" onClick={(event) => onSubmit(event)} aria-label="search">
              <SearchIcon />
            </IconButton>
          </FormControl>
        </Fab>
        <Grid container direction="row" spacing={2} alignItems="center" justify="flex-start">
          <Grid item xs={12} sm={2} lg={2}>
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
          <Grid item xs={12} sm={10} lg={9}>
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
        </Grid>
      </Paper>
    </Box>
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
