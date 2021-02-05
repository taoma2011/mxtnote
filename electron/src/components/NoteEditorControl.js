/* eslint-disable react/prop-types */
import React from 'react';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteEditorDialog from '../containers/NoteEditorDialog';

export default function NoteEditor(props) {
  // eslint-disable-next-line react/prop-types
  const { editingNid, finalizeEdit, openNoteEditor, deleteNote } = props;

  /*
  <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <TextField
          id="standard-multiline-flexible"
          label="Note"
          multiline
          rowsMax="4"
          value={editingText}
          onChange={handleTextChange}
        />
      </Popover>
      */
  return (
    <div>
      <Fab color="primary" aria-label="add" size="small" onClick={finalizeEdit}>
        <CheckIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        onClick={() => openNoteEditor(editingNid)}
      >
        <EditIcon />
      </Fab>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        onClick={() => deleteNote(editingNid)}
      >
        <DeleteIcon />
      </Fab>
      <NoteEditorDialog />
    </div>
  );
}
