import { connect } from 'react-redux';
import { CANCEL_DELETE_TODO, DELETE_TODO } from '../actions/file';
import DeleteTodoDialog from '../components/DeleteTodoDialog';
import { findTodoById } from '../utils/common';

// obsolete
function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { todos } = file || {};
  const tid = ownProps.context;
  const deletingTodo = findTodoById(todos, tid);
  const deleting = Boolean(deletingTodo.deleting);
  return {
    deleting,
    description: deletingTodo.description,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleClose: () => {
      return dispatch({
        type: CANCEL_DELETE_TODO,
        todoId: ownProps.context,
      });
    },
    deleteTodo: () => {
      return dispatch({
        type: DELETE_TODO,
        todoId: ownProps.context,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTodoDialog);
