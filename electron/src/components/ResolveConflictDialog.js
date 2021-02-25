/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ResolveConflictDialog(props) {
  // eslint-disable-next-line react/prop-types
  const {
    open,
    resolveConflictLocal,
    resolveConflictRemote,
    remoteDb,
    currentIndex,
    handleCancel,
    chooseLocal,
    chooseRemote,
    dataApi,
  } = props;

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle id="reset-confirm-dialog">Resolve Conflict</DialogTitle>
      <DialogContent>
        <DialogContentText>
          The note has been modified both locally and remotely,
        </DialogContentText>
        <DialogContentText>
          local: {resolveConflictLocal.text}
        </DialogContentText>
        <DialogContentText>
          remote: {resolveConflictRemote.text}
        </DialogContentText>
        <DialogContentText>which side should I use?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel(dataApi, remoteDb, currentIndex)}>
          Cancel
        </Button>
        <Button onClick={() => chooseLocal(dataApi, remoteDb, currentIndex)}>
          Local
        </Button>
        <Button onClick={() => chooseRemote(dataApi, remoteDb, currentIndex)}>
          Remote
        </Button>
      </DialogActions>
    </Dialog>
  );
}
