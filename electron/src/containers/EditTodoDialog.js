import { connect } from 'react-redux';
import { END_EDIT_TODO, TODO_DESCRIPTION_CHANGED } from '../actions/file';
import EditTodoDialog from '../components/EditTodoDialog';
import { findTodoById } from '../utils/common';

function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { todos } = file || {};
  const tid = ownProps.context;
  const editingTodo = findTodoById(todos, tid);
  const editing = Boolean(editingTodo.editing);
  return {
    editing,
    description: editingTodo.description
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleClose: () => {
      return dispatch({
        type: END_EDIT_TODO,
        todoId: ownProps.context
      });
    },
    handleDescriptionChange: e => {
      return dispatch({
        type: TODO_DESCRIPTION_CHANGED,
        todoId: ownProps.context,
        description: e.target.value
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTodoDialog);
