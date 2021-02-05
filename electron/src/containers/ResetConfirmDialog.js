import { connect } from "react-redux";
import { CLOSE_RESET_CONFIRM_DIALOG } from "../actions/file";
// import { isNewNote } from '../utils/common';
import ResetConfirmDialog from "../components/ResetConfirmDialog";

function mapStateToProps(state) {
  const { file } = state;
  const { openResetConfirmDialog } = file;

  return { open: openResetConfirmDialog };
}

function mapDispatchToProps(dispatch) {
  return {
    handleCancel: () =>
      dispatch({ type: CLOSE_RESET_CONFIRM_DIALOG, confirmed: false }),
    handleConfirm: () =>
      dispatch({ type: CLOSE_RESET_CONFIRM_DIALOG, confirmed: true })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetConfirmDialog);
