import { connect } from 'react-redux';
import LoadTodo from '../components/LoadTodo';
import { ADD_TODO_FROM_DB } from '../actions/file';

function mapDispatchToProps(dispatch) {
  return {
    addTodos: todos =>
      dispatch({
        type: ADD_TODO_FROM_DB,
        todos
      })
  };
}

export default connect(null, mapDispatchToProps)(LoadTodo);
