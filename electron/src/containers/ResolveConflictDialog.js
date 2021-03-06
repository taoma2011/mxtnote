import { connect } from 'react-redux';
// import { isNewNote } from '../utils/common';
import ResolveConflictDialog from '../components/ResolveConflictDialog';
import { mergeAndExport } from '../utils/remote';
import { RESOLVE_DONE } from '../actions/file';

function mapStateToProps(state) {
  const { file } = state;
  const {
    showResolveConflictDialog,
    resolveConflictLocal,
    resolveConflictRemote,
    remoteDb,
    currentIndex,
    dataApi,
  } = file;

  return {
    open: Boolean(showResolveConflictDialog),
    resolveConflictLocal: resolveConflictLocal || {},
    resolveConflictRemote: resolveConflictRemote || {},
    remoteDb,
    currentIndex,
    dataApi,
  };
}

function continueMergeThunk(dataApi, remoteDb, currIndex, resolveResult) {
  return function (dispatch) {
    return mergeAndExport(dataApi, remoteDb, currIndex, resolveResult).then(
      (result) => {
        dispatch(result);
        return true;
      }
    );
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleCancel: (dataApi, remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(dataApi, remoteDb, currentIndex, 'cancel'));
    },
    chooseLocal: (dataApi, remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(dataApi, remoteDb, currentIndex, 'local'));
    },
    chooseRemote: (dataApi, remoteDb, currentIndex) => {
      dispatch({ type: RESOLVE_DONE });
      dispatch(continueMergeThunk(dataApi, remoteDb, currentIndex, 'remote'));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResolveConflictDialog);
