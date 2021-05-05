/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi, selectDeletingNote } from './selector';
import * as ActionCreators from '../actions/ActionCreators';
import { deleteNote } from '../features/backend/backendSlice';

export default function DeleteNoteDialog(props) {
  const { deletingNoteId } = useSelector(selectDeletingNote);
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  // const note = dataApi.GetNoteById(deletingNoteId);

  return (
    <Dialog
      open={!!deletingNoteId}
      onClose={() => dispatch(ActionCreators.CloseDeleteNoteDialog())}
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
        <Button
          onClick={() => dispatch(ActionCreators.CloseDeleteNoteDialog())}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => dispatch(deleteNote({ noteId: deletingNoteId }))}
          color="primary"
          autoFocus
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
