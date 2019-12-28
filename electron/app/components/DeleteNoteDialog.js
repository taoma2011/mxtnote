/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function DeleteNoteDialog(props) {
  const { deleting, noteId, handleClose, deleteNote } = props;
  return (
    <Dialog
      open={deleting}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete note?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Delete this note permanently?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(noteId)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => deleteNote(noteId)} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
