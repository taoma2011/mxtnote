/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { selectApi } from './selector';
import { deleteTodo } from '../features/todo/todoSlice';
import { DELETE_TODO } from '../actions/file';

export default function DeleteTodoDialog(props) {
  const { todo, onClose } = props;

  const dispatch = useDispatch();

  const { description } = todo || {};
  const doDeleteTodo = () => {
    dispatch(
      deleteTodo({
        todo,
      })
    );
    onClose();
  };

  return (
    <Dialog
      open={todo !== null}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete TODO?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Delete TODO {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={doDeleteTodo} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
