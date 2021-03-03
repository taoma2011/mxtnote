/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi } from './selector';
import { DELETE_NOTE } from '../actions/file';

export default function DeleteNoteDialog(props) {
  const { noteId, onClose } = props;
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  const deleteNote = () => {
    dispatch({
      type: DELETE_NOTE,
      noteId,
    });
  };

  if (!noteId) {
    return null;
  }
  const note = dataApi.GetNoteById(noteId);

  return (
    <Dialog
      open={noteId !== null}
      onClose={onClose}
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteNote} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
