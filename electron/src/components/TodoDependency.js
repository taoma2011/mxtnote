/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default function TodoDependency(props) {
  // eslint-disable-next-line react/prop-types
  const { todos, checked, todoDependencyChanged } = props;
  console.log('checked is ', checked);
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
                checked={checked.indexOf(todo._id) !== -1}
                tabIndex={-1}
                disableRipple
                onClick={() => todoDependencyChanged(todo._id)}
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
