import useSearchValue from '../hooks/use-search-value';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { findAllByTestId } from '@testing-library/dom';

interface Props {
  setOpenDialog: Function;
  openDialog: boolean;
  searchTerm: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-120%)',
    },
    dialogTitle: {
      display: 'flex',
      flexDirection: 'column',
      width: '600px',
      [theme.breakpoints.down('xs')]: {
        width: 'calc(100vw - 80px)',
      },
      height: '25px',
      padding: 15,
      background: '#eeeeee',
      overflow: 'hidden',
    },
    dialogContent: {
      background: '#eeeeee',
      height: '300px',
      color: 'black',
      fontSize: '1.8rem',
    },
    input: {
      width: '100%',
      height: '25px',
      boxSizing: 'border-box',
      borderRadius: '20px',
      padding: '5px 18px',
      outline: 'none',
      border: 'none',
      marginBottom: '15px',
    },
    closeIcon: {
      fontSize: '2.8rem',
      position: 'absolute',
      padding: '10px',
      color: '#999999',
    },
    searchButton: {
      padding: '10px 25px',
      position: 'absolute',
      right: '10px',
      top: '10px',
      border: 'solid 1px #1ea0f0',
      borderRadius: '20px',
      outline: 'none',
      cursor: 'pointer',
      color: '#fff',
      background: '#1ea0f0',
      transition: 'background .2s',
      fontWeight: 'bold',
      '&:hover': {
        background: '#3da8e8',
      },
    },
    title: {
      display: 'inline',
      position: 'absolute',
      top: 0,
      marginLeft: '20px',
      overflow: 'hidden',
      fontSize: '1.8rem',
      color: '#999999',
    },
    formControl: {
      padding: 0,
      margin: 0,
    },
    formLabel: {
      fontSize: '1.8rem',
      color: 'black',
    },
  })
);

const AdvancedSearchDialog = (props: Props) => {
  const classes = useStyles();
  const { text, onTextChange, onFilterChange, onSubmitHandler } = useSearchValue();

  // const [state, setState] = React.useState({
  //   searchInAuthor: false,
  // });

  const [searchInAuthor, setSearchInAuthor] = useState(false);

  const handleClose = () => {
    props.setOpenDialog(false);
    setSearchInAuthor(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInAuthor(event.target.checked);
    if (searchInAuthor) {
      onFilterChange('author');
    } else {
      onFilterChange('post');
    }
    console.log('search in author:' + searchInAuthor);
  };

  return (
    <Dialog
      maxWidth="md"
      open={props.openDialog}
      onClose={handleClose}
      classes={{
        paper: classes.root,
      }}
    >
      <DialogTitle className={classes.dialogTitle}>
        <IconButton onClick={handleClose} aria-label="search">
          <CloseIcon className={classes.closeIcon} />
        </IconButton>

        <p className={classes.title}>Advanced Search</p>

        <button
          className={classes.searchButton}
          onClick={(e) => {
            if (text) {
              onSubmitHandler(e);
            }
            handleClose();
          }}
        >
          Search
        </button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <p>Keyword:</p>
        <form
          onSubmit={(e) => {
            // do later
          }}
        >
          <input
            autoFocus
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className={classes.input}
          />
        </form>
        <FormControl component="fieldset" className={classes.formControl}>
          <p>Search Options</p>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={searchInAuthor}
                  onChange={handleCheckboxChange}
                  name="searchInAuthor"
                />
              }
              label="Search in Authors"
            />
          </FormGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
