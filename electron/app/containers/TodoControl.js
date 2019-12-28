import { connect } from 'react-redux';
import { ADD_TODO } from '../actions/file';
import TodoControl from '../components/TodoControl';

function mapStateToProps(state) {
  const { file } = state;
  const { todos } = file || {};

  return {
    todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addTodo: description => {
      return dispatch({
        type: ADD_TODO,
        description
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoControl);
