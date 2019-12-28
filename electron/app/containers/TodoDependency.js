import { connect } from 'react-redux';
import TodoDependency from '../components/TodoDependency';
import { TODO_DEPENDENCY_CHANGE } from '../actions/file';
import { getMainState } from '../reducers';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const mainState = getMainState(state);
  const { todos, notes, editingNid } = mainState;

  const note = notes[editingNid];

  return {
    todos: todos || [],
    checked: note ? note.todoDependency || [] : []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    todoDependencyChanged: todoId =>
      dispatch({
        type: TODO_DEPENDENCY_CHANGE,
        todoId
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoDependency);
