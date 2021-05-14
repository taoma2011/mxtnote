/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { selectTodoById } from './selector';
import { editTodo } from '../features/todo/todoSlice';
import { TODO_DESCRIPTION_CHANGED } from '../actions/file';

export default function EditTodoDialog(props) {
  const { todo, onClose } = props;
  const dispatch = useDispatch();
  const { description } = todo || {};
  const [text, setText] = useState(description);
  const onCommit = () => {
    const newTodo = {
      ...todo,
      description: text,
    };
    dispatch(
      editTodo({
        todo: newTodo,
      })
    );
    onClose();
  };

  return (
    <Dialog
      open={todo !== null}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Todo</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onCommit} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
