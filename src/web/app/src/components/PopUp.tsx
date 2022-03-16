import { MouseEventHandler, useState } from 'react';

import { useRouter } from 'next/router';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles } from '@material-ui/core';

type PopUpProps = {
  messageTitle: string;
  message: string;
  buttonText?: string;
  agreeAction?: MouseEventHandler;
  disagreeAction?: MouseEventHandler;
  agreeButtonText: string;
  disagreeButtonText?: string;
  simple?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    dialogTitle: {
      '& .MuiTypography-h6': {
        fontSize: '2rem',
      },
    },
    dialogContent: {
      fontSize: '1.3rem',
    },
    button: {
      fontSize: '1rem',
    },
  })
);

const PopUp = ({
  messageTitle,
  message,
  agreeAction,
  disagreeAction,
  agreeButtonText,
  disagreeButtonText,
  simple,
  buttonText,
}: PopUpProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      <Dialog
        open={simple ? open : true}
        onClose={() => router.push('/')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          {messageTitle}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.dialogContent}>
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {disagreeAction && (
            <Button onClick={disagreeAction} color="primary" className={classes.button}>
              {disagreeButtonText}
            </Button>
          )}
          {simple && (
            <Button onClick={handleClose} color="primary" className={classes.button}>
              {buttonText}
            </Button>
          )}
          <Button onClick={agreeAction} color="primary" autoFocus className={classes.button}>
            {agreeButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopUp;
