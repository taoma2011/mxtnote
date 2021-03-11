import { connect } from 'react-redux';
import {
  SET_NOTE_TODO_FILTER,
  IMPORT_NOTE_FROM_REMOTE,
  IMPORT_NOTE,
  EXPORT_NOTE,
  OPEN_RESET_CONFIRM_DIALOG,
} from '../actions/file';
import NoteControl from '../components/NoteControl';
import { doSync, mergeAndExport } from '../reducers/file';
// import { exportRemoteDb } from '../utils/api';

function mapStateToProps(state) {
  const { file } = state;
  const { todos } = file || {};

  const { noteTodoFilter } = file || {};
  return {
    dataApi: file.dataApi,
    noteTodoFilter: noteTodoFilter || 'none',
    todos,
  };
}

function syncRemoteThunk(dataApi) {
  return function (dispatch) {
    return doSync(dataApi).then((result) => {
      dispatch(result);
      return true;
    });
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filterChanged: (e) =>
      dispatch({ type: SET_NOTE_TODO_FILTER, todoId: e.target.value }),
    importNoteFromRemote: (dataApi) => dispatch(syncRemoteThunk(dataApi)),
    importNote: () => dispatch({ type: IMPORT_NOTE }),

    exportNote: () => dispatch({ type: EXPORT_NOTE }),
    resetDb: () => dispatch({ type: OPEN_RESET_CONFIRM_DIALOG }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteControl);
