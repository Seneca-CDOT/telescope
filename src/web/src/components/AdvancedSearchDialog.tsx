import useSearchValue from '../hooks/use-search-value';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface Props {
  setOpenDialog: Function;
  openDialog: boolean;
  searchTerm: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transform: 'translateY(-230px)',
    },
    dialogTitle: {
      display: 'flex',
      flexDirection: 'column',
      width: '758px',
      height: '25px',
      padding: 15,
      background: 'pink',
    },
    dialogContent: {
      background: 'cyan',
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
      fontSize: '1.8rem',
    },
  })
);

const AdvancedSearchDialog = (props: Props) => {
  const classes = useStyles();
  const { text, onTextChange, onSubmitHandler } = useSearchValue();

  const handleClose = () => {
    props.setOpenDialog(false);
  };

  return (
    <Dialog
      maxWidth="md"
      className={classes.root}
      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
      open={props.openDialog}
      onClose={handleClose}
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
              handleClose();
            } else {
              handleClose();
            }
          }}
        >
          Search
        </button>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        Keywords:
        <form
          onSubmit={(e) => {
            if (text) {
              onSubmitHandler(e);
              handleClose();
            } else {
              handleClose();
            }
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
        Search options:
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchDialog;
