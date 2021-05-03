/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import NoteEditor from './NoteEditor';
import { selectNoteById } from './selector';
import { updateNote } from '../features/backend/backendSlice';

function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function NoteEditorDialog(props) {
  // eslint-disable-next-line react/prop-types
  const { open, noteId, handleClose } = props;
  const note = useSelector(selectNoteById(noteId));
  const origNoteText = note ? note.text : '';
  console.log('got note ', note);
  const [newNoteText, setNewNoteText] = React.useState('');
  const [noteTextChanged, setNoteTextChanged] = React.useState(false);
  const handleTextChange = (e) => {
    setNewNoteText(e.target.value);
    setNoteTextChanged(true);
  };
  const dispatch = useDispatch();
  const handleSave = async () => {
    if (noteTextChanged) {
      note.text = newNoteText;
      dispatch(updateNote({ noteId, note }));
    }
    handleClose();
  };
  const handleCancel = () => {
    setNoteTextChanged(false);
    handleClose();
  };
  console.log('noteeditor dialog open=', open);
  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Edit Note
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit note text and select associated TODO
        </DialogContentText>

        <NoteEditor
          noteText={noteTextChanged ? newNoteText : origNoteText}
          textChanged={handleTextChange}
          noteId={noteId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
