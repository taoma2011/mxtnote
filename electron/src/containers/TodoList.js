import { connect } from 'react-redux';
import TodoList from '../components/TodoList';
import {
  GOTO_TODO,
  START_DELETE_TODO,
  START_EDIT_TODO,
  TOGGLE_TODO_DONE,
} from '../actions/file';

// obsolete, use component directory
// eslint-disable-next-line no-unused-vars
function mapStateToProps(state, ownProp) {
  const { file } = state;
  const { todos } = file || {};

  return {
    hasEditDelete: true,
    todos: todos || [],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoTodo: (todoId) =>
      dispatch({
        type: GOTO_TODO,
        todoId,
      }),
    editTodo: (todoId) =>
      dispatch({
        type: START_EDIT_TODO,
        todoId,
      }),
    deleteTodo: (todoId) =>
      dispatch({
        type: START_DELETE_TODO,
        todoId,
      }),
    toggleTodoDone: (todoId) =>
      dispatch({
        type: TOGGLE_TODO_DONE,
        todoId,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
