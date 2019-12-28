import { connect } from 'react-redux';
import {
  SET_NOTE_TODO_FILTER,
  IMPORT_NOTE,
  EXPORT_NOTE,
  RESET_DB
} from '../actions/file';
import NoteControl from '../components/NoteControl';

function mapStateToProps(state) {
  const { file } = state;
  const { todos } = file || {};

  const { noteTodoFilter } = file || {};
  return { noteTodoFilter: noteTodoFilter || 'none', todos };
}

function mapDispatchToProps(dispatch) {
  return {
    filterChanged: e =>
      dispatch({ type: SET_NOTE_TODO_FILTER, todoId: e.target.value }),
    importNote: () => dispatch({ type: IMPORT_NOTE }),
    exportNote: () => dispatch({ type: EXPORT_NOTE }),
    resetDb: () => dispatch({ type: RESET_DB })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteControl);
