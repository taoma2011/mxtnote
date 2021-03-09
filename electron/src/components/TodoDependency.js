/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { selectTodos, selectEditingNote } from './selector';
import * as ActionCreators from '../actions/ActionCreators';

export default function TodoDependency(props) {
  const todos = useSelector(selectTodos);
  const { editingNid, editingNote } = useSelector(selectEditingNote);
  const dispatch = useDispatch();
  if (!editingNote) {
    return null;
  }
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
                onClick={() =>
                  dispatch(ActionCreators.todoDependencyChange(todo.id))
                }
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
