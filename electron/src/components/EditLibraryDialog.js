/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi } from './selector';
import { DOCUMENT_DESCRIPTION_CHANGED } from '../actions/file';

export default function EditLibraryDialog(props) {
  const { fileId, onClose } = props;
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  const file = dataApi.GetDocumentById(fileId);
  const { description, fileName } = file || {};

  const [text, setText] = useState(description);
  if (!file) {
    return null;
  }

  const handleDescriptionChange = (e) => {
    return dispatch({
      type: DOCUMENT_DESCRIPTION_CHANGED,
      fileId,
      description: text,
    });
  };

  return (
    <Dialog
      open={fileId !== null}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Document</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Description"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Typography>{fileName}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDescriptionChange} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
