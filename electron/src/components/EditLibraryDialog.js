/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi, selectEditingFile } from './selector';
import { DOCUMENT_DESCRIPTION_CHANGED, UPDATE_UI } from '../actions/file';

export default function EditLibraryDialog(props) {
  const { onClose } = props;
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();
  const { editingFileId, editingFile } = useSelector(selectEditingFile);
  const { description, fileName } = editingFile || {};

  const [text, setText] = useState('');
  useEffect(() => {
    if (editingFile) {
      setText(editingFile.description);
    }
  }, [editingFile]);
  console.log(`editingFileId = ${editingFileId}`);
  if (!editingFile) {
    return null;
  }

  const handleDescriptionChange = async (e) => {
    // call the dataApi
    editingFile.description = text;
    await dataApi.UpdateDocument(editingFileId, editingFile);
    onClose();
  };

  return (
    <Dialog
      open={Boolean(editingFileId)}
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
