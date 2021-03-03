/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Paper from '@material-ui/core/Paper';

import TodoControl from '../containers/TodoControl';
import TodoList from './TodoList';

export default function TodoPage() {
  return (
    <Paper height="100%">
      <TodoControl />
      <TodoList />
    </Paper>
  );
}
