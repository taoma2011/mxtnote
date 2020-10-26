import { connect } from "react-redux";
import { IMPORT_NOTE_FROM_REMOTE, RESOLVE_DONE } from "../actions/file";
// import { isNewNote } from '../utils/common';
import ResolveConflictDialog from "../components/ResolveConflictDialog";
import { doSync, mergeAndExport } from "../reducers/file";
function mapStateToProps(state) {
  const { file } = state;
  const {
    showResolveConflictDialog,
    resolveConflictLocal,
    resolveConflictRemote,
    remoteDb,
    currentIndex,
  } = file;

  return {
    open: Boolean(showResolveConflictDialog),
    resolveConflictLocal: resolveConflictLocal || {},
    resolveConflictRemote: resolveConflictRemote || {},
    remoteDb,
    currentIndex,
  };
}

function continueMergeThunk(remoteDb, currIndex, resolveResult) {
  return function(dispatch) {
    return mergeAndExport(remoteDb, currIndex, resolveResult).then((result) => {
      dispatch({ type: IMPORT_NOTE_FROM_REMOTE });
    });
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleCancel: (remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(remoteDb, currentIndex, "cancel"));
    },
    chooseLocal: (remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(remoteDb, currentIndex, "local"));
    },
    chooseRemote: (remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(remoteDb, currentIndex, "remote"));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolveConflictDialog);
