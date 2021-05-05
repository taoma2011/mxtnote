/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { selectTodos, selectEditingNote, selectApi } from './selector';
import * as ActionCreators from '../actions/ActionCreators';
import { toggleTodoDependency } from '../utils/common';
import { updateNote } from '../features/backend/backendSlice';

export default function TodoDependency(props) {
  const todos = useSelector(selectTodos);
  const { dataApi } = useSelector(selectApi);
  const { editingNoteId, editingNote } = useSelector(selectEditingNote);
  const dispatch = useDispatch();
  if (!editingNote) {
    return null;
  }
  const handleDependencyChange = (todoId) => {
    const newNote = toggleTodoDependency(dataApi, editingNoteId, todoId);
    dispatch(
      updateNote({
        dataApi,
        noteId: editingNoteId,
        note: newNote,
      })
    );
  };
  return (
    <List>
      {todos.map((todo, index) => {
        const key = `todo-li-${index}`;
        const checkboxLabel = `checkbox-list-label-${index}`;
        return (
          <ListItem key={key} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={editingNote.todoDependency.indexOf(todo.id) !== -1}
                tabIndex={-1}
                disableRipple
                onClick={() => handleDependencyChange(todo.id)}
                inputProps={{ 'aria-labelledby': checkboxLabel }}
              />
            </ListItemIcon>

            <ListItemText primary={todo.description} />
          </ListItem>
        );
      })}
    </List>
  );
}
