import { MouseEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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

import SearchInput from './SearchInput/SearchInput';
import SearchHelp from './SearchHelp';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'visible',
      maxWidth: '785px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(2, 2, 0, 2),
      marginBottom: theme.spacing(6),
    },
    card: {
      padding: theme.spacing(0, 0, 0, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '50px',
      background: '#d1d1d1',
      border: 'solid 1px transparent',
      transition: 'background-color .5s',
      '&:hover': {
        backgroundColor: '#ffffff',
        border: 'solid 1px #999999',
      },
      [theme.breakpoints.down('xs')]: {
        // background: 'red',
        borderRadius: '15px',
        padding: theme.spacing(0, 0, 0, 2),
      },
    },
    header: {
      padding: 0,
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
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
      backgroundColor: '#999999',
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
        width: 'auto',
        transform: 'translateY(2px)',
        fontSize: '1.5rem',
        textTransform: 'capitalize',
        color: theme.palette.primary.main,
        paddingLeft: '2rem',
        [theme.breakpoints.down('xs')]: {
          paddingLeft: '1rem',
          width: '10rem',
          transform: 'translateY(15px)',
        },
      },
    },
    selectItem: {
      fontSize: '1.4rem',
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
    },
  })
);

type searchBarProps = {
  text: string;
  onTextChange: Function;
  filter: string;
  onFilterChange: Function;
  onSubmit: (e: MouseEvent<HTMLButtonElement>) => void;
};

const SearchBar = ({ text, onTextChange, onFilterChange, filter, onSubmit }: searchBarProps) => {
  const classes = useStyles();

  const searchOptions = ['post', 'author'];

  return (
    <Box className={classes.root}>
      <Paper component="form" className={classes.card} elevation={0}>
        <Grid container direction="row" spacing={2} alignItems="center" justify="flex-start">
          <Grid item xs={12} sm={2} lg={2}>
            <FormControl fullWidth>
              <TextField
                id="standard-select-search-type"
                select
                value={filter}
                InputProps={{ disableUnderline: true }}
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
              <SearchInput searchFilter={filter} text={text} onTextChange={onTextChange} />
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

export default SearchBar;
