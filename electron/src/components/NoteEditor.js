/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
// import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TodoDependency from './TodoDependency';
import * as ActionCreators from '../actions/ActionCreators';
import { selectNoteById } from './selector';

export default function NoteEditor(props) {
  const { noteId } = props;
  const note = useSelector(selectNoteById(noteId));

  const handleTextChange = (e) => {};
  return (
    <Grid container>
      <Grid item xs={12} style={{ display: 'flex' }}>
        <TextareaAutosize
          style={{ flexGrow: 1 }}
          m={2}
          id="standard-multiline-flexible"
          label="Note"
          value={note.text}
          onChange={handleTextChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TodoDependency context={noteId} />
      </Grid>
    </Grid>
  );
}
