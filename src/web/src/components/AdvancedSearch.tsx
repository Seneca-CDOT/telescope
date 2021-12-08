import CloseIcon from '@material-ui/icons/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DateSearchInput from './SearchInput/DateSearchInput';
import AuthorSearchInput from './SearchInput/AuthorSearchInput';
import PostSearchInput from './SearchInput/PostSearchInput';
import TitleSearchInput from './SearchInput/TitleSearchInput';

interface Props {
  setOpenDialog: Function;
  openDialog: boolean;
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
      '& p': {
        color: '#999999',
      },
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: '20px',
      padding: '10px 15px',
      outline: 'none',
      border: 'solid 1px #999',
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
    closeButton: {
      padding: '10px 25px',
      border: 'solid 1px #cf0000',
      borderRadius: '20px',
      outline: 'none',
      cursor: 'pointer',
      color: '#fff',
      background: '#cf0000',
      transition: 'background .2s',
      fontWeight: 'bold',
      '&:hover': {
        background: '#940000',
      },
    },
    title: {
      display: 'inline',
      position: 'absolute',
      top: 0,
      marginLeft: '20px',
      overflow: 'hidden',
      fontSize: '1.6rem',
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

const AdvancedSearch = (props: Props) => {
  const router = useRouter();
  const classes = useStyles();

  const [newSearchTerm, setnewSearchTerm] = useState('');

  const handleClose = () => {
    props.setOpenDialog(false);
  };

  const handleSearch = () => {
    // Route for what to show in the web app.
    // router.push(
    //   `/?author=${encodeURIComponent(author)}&post=${encodeURIComponent(
    //     post
    //   )}&title=${encodeURIComponent(title)}${from ? `&from=${from}` : ''}${
    //     from ? `&from=${from}` : ''
    //   }`
    // );
  };

  return (
    <Dialog maxWidth="md" open={props.openDialog} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>
        <p className={classes.title}>Advanced Search</p>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <FormControl
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();

            handleClose();
          }}
          fullWidth
        >
          {/* Author */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <p>Author: </p>
            </Grid>
            <Grid item xs={12} sm={8}>
              <AuthorSearchInput />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <TitleSearchInput />
          </Grid>
          <Grid container spacing={3}>
            <PostSearchInput />
          </Grid>
          {/* Date range */}
          <Grid container>
            <DateSearchInput />
          </Grid>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <button
          className={classes.searchButton}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSearch();

            handleClose();
          }}
        >
          Search
        </button>

        <button
          className={classes.closeButton}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedSearch;
