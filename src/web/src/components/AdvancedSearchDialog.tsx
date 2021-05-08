import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

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

const AdvancedSearchDialog = (props: Props) => {
  const router = useRouter();
  const classes = useStyles();

  const [newSearchTerm, setnewSearchTerm] = useState('');
  const [advancedSearchInAuthor, setAdvancedSearchInAuthor] = useState(false);

  const handleClose = () => {
    props.setOpenDialog(false);
    setAdvancedSearchInAuthor(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedSearchInAuthor(e.target.checked);
  };

  const handleSearch = (searchTerm: string) => {
    if (advancedSearchInAuthor) router.push(`/search?text=${searchTerm}&filter=author`);
    else router.push(`/search?text=${searchTerm}&filter=post`);
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
            if (newSearchTerm) {
              e.preventDefault();
              handleSearch(newSearchTerm);
            }
            handleClose();
          }}
        >
          Search
        </button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <form
          onSubmit={(e) => {
            if (newSearchTerm) {
              e.preventDefault();
              handleSearch(newSearchTerm);
            }
            handleClose();
          }}
        >
          <input
            autoFocus
            type="text"
            value={newSearchTerm}
            onChange={(e) => setnewSearchTerm(e.target.value)}
            className={classes.input}
          />
        </form>
        <FormControl component="fieldset" className={classes.formControl}>
          <p>Filters</p>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={advancedSearchInAuthor} onChange={handleCheckboxChange} />
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
