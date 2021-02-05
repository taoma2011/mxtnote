/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
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
import EditTodoDialog from '../containers/EditTodoDialog';
import DeleteTodoDialog from '../containers/DeleteTodoDialog';
import { getTodoId } from '../utils/common';

export default function TodoList(props) {
  // eslint-disable-next-line react/prop-types
  const {
    todos,
    hasCheckbox,
    initiallyChecked,
    hasEditDelete,
    // gotoTodo,
    editTodo,
    deleteTodo,
    toggleTodoDone
  } = props;

  const handleClickTodo = () => {
    // const todo = todos[index];
    // eslint-disable-next-line no-underscore-dangle
    // gotoTodo(todo._id);
  };

  const handleDeleteTodo = index => {
    const todo = todos[index];
    deleteTodo(todo._id);
  };

  let checked = initiallyChecked;
  const checkedByIndex = [];
  for (let i = 0; i < todos.length; i += 1) {
    checkedByIndex.push(false);
  }

  const handleChecked = index => {
    const newChecked = [];
    checkedByIndex[index] = !checkedByIndex[index];
    for (let i = 0; i < todos.length; i += 1) {
      if (checkedByIndex[i]) {
        newChecked.push(i);
      }
    }
    checked = newChecked;
  };

  return (
    <List>
      {todos.map((todo, index) => {
        const key = `todo-li-${index}`;
        const checkboxLabel = `checkbox-list-label-${index}`;
        return (
          <ListItem
            key={key}
            dense
            button
            onClick={() => handleClickTodo(index)}
          >
            {hasCheckbox && (
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  onClick={() => handleChecked(index)}
                  inputProps={{ 'aria-labelledby': checkboxLabel }}
                />
              </ListItemIcon>
            )}
            <ListItemText primary={todo.description} />
            <EditTodoDialog context={getTodoId(todo)} />
            <DeleteTodoDialog context={getTodoId(todo)} />

            {hasEditDelete && (
              <ListItemSecondaryAction>
                <ToggleButton
                  value="check"
                  size="small"
                  onChange={() => toggleTodoDone(getTodoId(todo))}
                  selected={todo.done}
                >
                  Done
                </ToggleButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => editTodo(getTodoId(todo))}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTodo(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        );
      })}
    </List>
  );
}
