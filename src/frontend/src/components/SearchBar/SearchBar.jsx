import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

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
  Tooltip,
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
      fontSize: '3rem',
      color: theme.palette.text.primary,
    },
    margin: 0,
    marginLeft: 15,
    position: 'relative',
    bottom: theme.spacing(6),
    float: 'right',
    marginBottom: theme.spacing(-5.5),
  },
  infoButton: {
    marginTop: '50px',
    marginLeft: '-20px',
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

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(22.5),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

function CustomizedInputBase(props) {
  const classes = useStyles();
  const { text, onTextChange, onFilterChange, filter, onSubmit } = props;

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
          <HtmlTooltip
            className={classes.infoButton}
            title={
              <React.Fragment>
                <Typography variant="h5">How to use search</Typography>
                <ul>
                  <li>
                    <b>{"' + '"}</b>
                    {' signifies AND operator'}
                  </li>
                  <li>
                    <b>{"' | '"}</b>
                    {' signifies OR operator'}
                  </li>
                  <li>
                    <b>{"' - '"}</b>
                    {' negates a single token'}
                  </li>
                  <li>
                    <b>{"' \" '"}</b>
                    {' wraps a number of tokens to signify a phrase for searching'}
                  </li>
                  <li>
                    <b>{"' * '"}</b>
                    {' at the end of a term signifies a prefix query'}
                  </li>
                  <li>
                    <b>{"' ( ' and ' ) '"}</b>
                    {' signify precendence '}
                  </li>
                  <li>
                    <b>{"' ~N '"}</b>
                    {' after a word signifies edit distance (fuzziness)'}
                  </li>
                  <li>
                    <b>{"' ~N '"}</b>
                    {' after a phrase signifies slop amount'}
                  </li>
                </ul>
              </React.Fragment>
            }
          >
            <Fab size="large" className={classes.iconButton}>
              <IconButton aria-label="Info" fontSize="large">
                <InfoOutlinedIcon />
              </IconButton>
            </Fab>
          </HtmlTooltip>
        </Grid>
        <Fab size="large" className={classes.iconButton}>
          <FormControl>
            <IconButton type="submit" onClick={onSubmit} aria-label="search">
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
            <FormControl fullWidth={true}>
              <TextField
                className={classes.input}
                placeholder="How to Get Started in Open Source"
                inputProps={{ 'aria-label': 'search telescope' }}
                variant="outlined"
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

CustomizedInputBase.propTypes = {
  text: PropTypes.string,
  onTextChange: PropTypes.func,
  filter: PropTypes.string,
  onFilterChange: PropTypes.func,
  onSubmit: PropTypes.func,
};
export default CustomizedInputBase;
