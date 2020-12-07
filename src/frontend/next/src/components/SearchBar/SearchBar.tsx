import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
} from '@material-ui/core';

import SearchInput from '../SearchInput';
import SearchHelp from '../SearchHelp';

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
      color: theme.palette.primary.contrastText,
    },
    margin: 0,
    position: 'absolute',
    right: '10px',
    top: '6px',
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

interface CustomizedInputBaseProps {
  text: string | null;
  onTextChange(): void;
  filter: string | null;
  onFilterChange(value: string): any;
  onSubmit(): any;
}

const CustomizedInputBase: FC<CustomizedInputBaseProps> = ({
  text,
  onTextChange,
  onFilterChange,
  filter,
  onSubmit,
}: CustomizedInputBaseProps) => {
  const classes = useStyles();

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
          <Grid item>
            <Typography variant="h1" className={classes.h1}>
              Search
            </Typography>
          </Grid>
          <SearchHelp />
        </Grid>
        <Grid container direction="row" spacing={2} alignItems="center" justify="flex-start">
          <Grid item xs={12} sm={2} lg={2}>
            <FormControl fullWidth>
              <TextField
                id="standard-select-search-type"
                select
                label="Filter"
                value={filter}
                variant="outlined"
                className={classes.selectControl}
                onChange={(event) => onFilterChange(event.target.value)}
              >
                {searchOptions.map((option) => (
                  <MenuItem key={option} value={option} className={classes.selectItem}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={10} lg={10}>
            <FormControl fullWidth>
              <SearchInput filter={filter} text={text} onChange={onTextChange} />
              <IconButton
                className={classes.iconButton}
                type="submit"
                onClick={onSubmit}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CustomizedInputBase;
