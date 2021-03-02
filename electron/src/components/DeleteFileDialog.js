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
import { DELETE_FILE } from '../actions/file';

export default function DeleteFileDialog(props) {
  const { fileId, onClose } = props;
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  if (!fileId) {
    return null;
  }
  const file = dataApi.GetDocumentById(fileId);
  const { description } = file;

  const deleteFile = () => {
    dispatch({
      type: DELETE_FILE,
      fileId,
    });
  };

  return (
    <Dialog
      open={fileId !== null}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete file from library?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Delete {description} from library? (the file itself will not be
          deleted)
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteFile} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
