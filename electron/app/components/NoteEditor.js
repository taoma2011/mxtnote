/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TodoDependency from '../containers/TodoDependency';

export default function NoteEditor2(props) {
  const { text, noteId, handleTextChange } = props;
  return (
    <Grid container>
      <Grid item xs={12} style={{ display: 'flex' }}>
        <TextareaAutosize
          style={{ flexGrow: 1 }}
          m={2}
          id="standard-multiline-flexible"
          label="Note"
          value={text}
          onChange={handleTextChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TodoDependency context={noteId} />
      </Grid>
    </Grid>
  );
}
