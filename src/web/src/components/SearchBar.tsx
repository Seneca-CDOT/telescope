import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, MenuItem, TextField, FormControl, Paper, IconButton, Box } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'visible',
      maxWidth: '785px',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(2, 2, 0, 2),
      marginBottom: theme.spacing(10),
    },
    card: {
      padding: theme.spacing(0, 0, 0, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '50px',
      background: theme.palette.background.paper,
      border: 'solid 1px transparent',
      transition: 'background-color .5s',
      '&:hover': {
        backgroundColor: theme.palette.type === 'light' ? '#ffffff' : '#000000',
        border: 'solid 1px #999999',
      },
      [theme.breakpoints.down('xs')]: {
        borderRadius: '15px',
        padding: theme.spacing(0, 0, 0, 2),
      },
    },
    input: {
      fontSize: '1.8rem',
      width: '100%',
      boxSizing: 'border-box',
      height: '56px',
      outline: 'none',
      border: 'solid 1px transparent',
      borderRadius: '50px',
      paddingLeft: '55px',
      background: '#EEEEEE',
      position: 'absolute',
      transition: 'border .2s',
      '&:hover': {
        border: 'solid 1px #999999',
      },
      '&:focus': {
        border: 'solid 1px #999999',
      },
    },
    iconButton: {
      backgroundColor: '#EEEEEE',
      color: '#999999',
      '&:hover': {
        backgroundColor: '#EEEEEE',
      },
      '& * > .MuiSvgIcon-root': {
        fontSize: '2rem',
      },
      margin: 0,
      position: 'absolute',
      left: '10px',
      top: '6px',
    },
    clearIcon: {
      color: '#999999',
      '&:hover': {
        backgroundColor: '#EEEEEE',
      },
      '& * > .MuiSvgIcon-root': {
        fontSize: '3rem',
      },

      margin: 0,
      position: 'absolute',
      right: '5px',
      top: '1px',
    },
    xxx: {
      top: '10px',
      right: '10px',
    },
  })
);

const SearchBar = () => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState('');

  const [advancedSearchButtonVisible, setAdvancedSearchButtonVisible] = useState(false);

  const router = useRouter();

  const handleSearch = (searchType: string) => {
    if (searchType) {
      if (searchType.toUpperCase() === 'AUTHOR') {
        router.push(`/search?text=${keyword}&filter=author`);
      } else {
        router.push(`/search?text=${keyword}&filter=post`);
      }
    } else {
      router.push(`/search?text=${keyword}&filter=post`);
    }
  };

  return (
    <Box className={classes.root}>
      <FormControl fullWidth>
        <Grid item xs={12} sm={10} lg={10}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch('');
            }}
          >
            <input
              className={classes.input}
              value={keyword}
              placeholder="Search..."
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setAdvancedSearchButtonVisible(true)}
              // onBlur={() => setdropdownVisible(false)}
            />

            <IconButton
              className={classes.iconButton}
              type="submit"
              onClick={() => handleSearch('')}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>

            {Boolean(advancedSearchButtonVisible && keyword) && (
              <IconButton
                className={classes.iconButton}
                type="submit"
                onClick={() => handleSearch('')}
                aria-label="search"
              >
                <SettingsIcon />
              </IconButton>
            )}

            <IconButton
              className={classes.clearIcon}
              onClick={() => setKeyword('')}
              aria-label="search"
            >
              <ClearIcon />
            </IconButton>
          </form>
        </Grid>
      </FormControl>
    </Box>
  );
};

export default SearchBar;
