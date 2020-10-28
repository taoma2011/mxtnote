import { connect } from "react-redux";
import { SYNC_DONE } from "../actions/file";
// import { isNewNote } from '../utils/common';
import SyncProgressDialog from "../components/SyncProgressDialog";
function mapStateToProps(state) {
  const { file } = state;
  const { showSyncProgress, syncProgress } = file;

  return {
    open: Boolean(showSyncProgress),
    progress: syncProgress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    done: () => dispatch({ type: SYNC_DONE }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncProgressDialog);
