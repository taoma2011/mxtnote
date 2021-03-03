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
import { DELETE_TODO } from '../actions/file';

export default function DeleteTodoDialog(props) {
  const { todoId, onClose } = props;
  const { apiState, dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();
  const todo = apiState === 'ok' ? dataApi.GetTodoById(todoId) : {};
  const { description } = todo || {};
  const deleteTodo = () => {
    return dispatch({
      type: DELETE_TODO,
      todoId,
    });
  };

  return (
    <Dialog
      open={todoId !== null}
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
        <Button onClick={deleteTodo} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
