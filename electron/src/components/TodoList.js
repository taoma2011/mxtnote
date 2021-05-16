/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import ToggleButton from '@material-ui/lab/ToggleButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditTodoDialog from './EditTodoDialog';
import DeleteTodoDialog from './DeleteTodoDialog';
import { getTodoId } from '../utils/common';
import { selectTodos } from './selector';
import {
  GOTO_TODO,
  START_DELETE_TODO,
  START_EDIT_TODO,
  TOGGLE_TODO_DONE,
} from '../actions/file';

export default function TodoList(props) {
  // eslint-disable-next-line react/prop-types
  const { hasCheckbox, initiallyChecked, hasEditDelete } = props;

  const todos = useSelector(selectTodos, shallowEqual);
  const dispatch = useDispatch();

  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);
  return (
    <>
      <List>
        {todos.map((todo, index) => {
          const key = `todo-li-${index}`;
          const checkboxLabel = `checkbox-list-label-${index}`;
          return (
            <ListItem key={key} dense button>
              <ListItemText primary={todo.description} />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => setEditingTodo(todo)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => setDeletingTodo(todo)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <EditTodoDialog todo={editingTodo} onClose={() => setEditingTodo(null)} />
      <DeleteTodoDialog
        todo={deletingTodo}
        onClose={() => setDeletingTodo(null)}
      />
    </>
  );
}
