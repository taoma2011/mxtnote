/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi, selectDeletingFile } from './selector';
import { UPDATE_UI } from '../actions/file';

export default function DeleteFileDialog(props) {
  const { onClose } = props;
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  const { deletingFileId, deletingFile } = useSelector(selectDeletingFile);

  console.log('deleting file id is ', deletingFileId);

  const { description } = deletingFile || {};

  const deleteFile = async () => {
    await dataApi.DeleteDocumentByFileId(deletingFileId);

    onClose();
    dispatch({
      type: UPDATE_UI,
    });
  };

  return (
    <Dialog
      open={Boolean(deletingFileId)}
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
