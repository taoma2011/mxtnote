import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Save';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ElectronFileInputButton } from './ElectronFileInputButton';
import { WebFileInputButton } from './WebFileInputButton';
import { selectApi } from './selector';
import { ADD_FILE } from '../actions/file';

export default function LibraryControl(props) {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [fileName, setFileName] = React.useState('');
  const [fileContent, setFileContent] = React.useState(null);
  const { dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();

  const addFileToLibrary = async () => {
    const newFile = {
      file: fileName,
      description,
      content: fileContent,
    };
    const newId = await dataApi.AddDocument(newFile);
    if (newId !== '') {
      dispatch({
        type: ADD_FILE,
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (name, content) => {
    setFileName(name);
    setFileContent(content);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAdd = () => {
    setOpen(false);
    addFileToLibrary();
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
          <WebFileInputButton label="Select" onFileSelected={handleSelect} />
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
