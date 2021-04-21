import { useState, useRef } from 'react';
import useSearchValue from '../hooks/use-search-value';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, FormControl, IconButton, Box, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AdvancedSearchDialog from './AdvancedSearchDialog';

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
      transition: 'box-shadow .3s, background .3s',
      '&:focus': {
        boxShadow: '0 0 5px 2px #CCCCCC',
        background: '#FFFFFF',
      },
    },
    iconButton: {
      backgroundColor: 'transparent',
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
        backgroundColor: 'transparent',
      },
      '& * > .MuiSvgIcon-root': {
        fontSize: '3rem',
      },
      margin: 0,
      position: 'absolute',
      right: '5px',
      top: '1px',
    },
    advancedSearchBtn: {
      position: 'absolute',
      top: '60px',
      right: '15px',
      width: 'auto',
      padding: '5px 10px',
      outline: 'none',
      border: 'none',
      background: 'transparent',
      color: '#999999',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  })
);

const SearchBar = () => {
  const classes = useStyles();
  const searchInput = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dataToDialog, setDataToDialog] = useState({});

  const { text, onTextChange, onSubmitHandler } = useSearchValue();

  function handleFocus() {
    if (searchInput && searchInput.current) {
      // @ts-ignore: Object is possibly 'null'.
      searchInput.current.focus();
    }
  }

  return (
    <div>
      <Box className={classes.root}>
        <FormControl fullWidth>
          <Grid item xs={12} sm={10} lg={10}>
            <form onSubmit={(e) => onSubmitHandler(e)}>
              <input
                autoFocus
                ref={searchInput}
                className={classes.input}
                value={text}
                placeholder="Search..."
                onChange={(e) => onTextChange(e.target.value)}
              />

              <IconButton
                onClick={(e) => {
                  if (text) onSubmitHandler(e);
                }}
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>

              {Boolean(text) && (
                <IconButton
                  className={classes.clearIcon}
                  onClick={() => {
                    onTextChange('');
                    handleFocus();
                  }}
                  aria-label="clear"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </form>
          </Grid>
          <button
            color="primary"
            className={classes.advancedSearchBtn}
            onClick={() => {
              setDataToDialog(text);
              setOpenDialog(true);
            }}
          >
            Advanced Search
          </button>
        </FormControl>
      </Box>

      <AdvancedSearchDialog
        searchTerm={dataToDialog}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </div>
  );
};

export default SearchBar;
