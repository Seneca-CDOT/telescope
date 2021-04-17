import { MouseEventHandler } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type PopUpProps = {
  messageTitle: string;
  message: string;
  agreeAction: MouseEventHandler;
  disagreeAction?: MouseEventHandler;
  agreeButtonText: string;
  disagreeButtonText?: string;
};

const PopUp = ({
  messageTitle,
  message,
  agreeAction,
  disagreeAction,
  agreeButtonText,
  disagreeButtonText,
}: PopUpProps) => {
  return (
    <>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{messageTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {disagreeAction && (
            <Button onClick={disagreeAction} color="primary">
              {disagreeButtonText}
            </Button>
          )}
          <Button onClick={agreeAction} color="primary" autoFocus>
            {agreeButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PopUp;
