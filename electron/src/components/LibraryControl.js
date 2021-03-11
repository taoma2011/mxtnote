import React from 'react';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Save';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function LibraryControl(props) {
  // eslint-disable-next-line react/prop-types
  const { addFileToLibrary } = props;

  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = () => {
    // eslint-disable-next-line global-require
    /* TODO
    const { dialog } = require('electron').remote;
    const files = dialog.showOpenDialogSync();
    // const files = window.electron.dialog.showOpenDialogSync();
    console.log('files is ', files);
    if (files) {
      console.log('open file ', files[0]);
      setFileName(files[0]);
    }
    */
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAdd = () => {
    setOpen(false);
    addFileToLibrary(fileName, description);
  };

  return (
    <Container>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add File
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Document</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a document to library, enter description and select file
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            fullWidth
            onChange={handleDescriptionChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="File"
            value={fileName}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSelect}
          >
            Select
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
