import { connect } from "react-redux";
import {
  SET_NOTE_TODO_FILTER,
  IMPORT_NOTE_FROM_REMOTE,
  IMPORT_NOTE,
  EXPORT_NOTE,
  OPEN_RESET_CONFIRM_DIALOG,
} from "../actions/file";
import NoteControl from "../components/NoteControl";
import { doSync } from "../reducers/file";
import { exportRemoteDb } from "../utils/api";

function mapStateToProps(state) {
  const { file } = state;
  const { todos } = file || {};

  const { noteTodoFilter } = file || {};
  return { noteTodoFilter: noteTodoFilter || "none", todos };
}

function syncRemoteThunk() {
  return function(dispatch) {
    return doSync().then(() => dispatch({ type: IMPORT_NOTE_FROM_REMOTE }));
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filterChanged: (e) =>
      dispatch({ type: SET_NOTE_TODO_FILTER, todoId: e.target.value }),
    importNoteFromRemote: () => dispatch(syncRemoteThunk()),
    importNote: () => dispatch({ type: IMPORT_NOTE }),

    exportNote: () => dispatch({ type: EXPORT_NOTE }),
    resetDb: () => dispatch({ type: OPEN_RESET_CONFIRM_DIALOG }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteControl);
