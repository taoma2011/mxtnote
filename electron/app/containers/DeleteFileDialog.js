import { connect } from 'react-redux';
import { CANCEL_DELETE_FILE, DELETE_FILE } from '../actions/file';
import DeleteFileDialog from '../components/DeleteFileDialog';
import { findFileById } from '../utils/common';

function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { files } = file || {};
  const fid = ownProps.context;
  const deletingFile = findFileById(files, fid);
  const deleting = Boolean(deletingFile.deleting);
  return {
    deleting,
    description: deletingFile.description
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleClose: () => {
      return dispatch({
        type: CANCEL_DELETE_FILE,
        fileId: ownProps.context
      });
    },
    deleteFile: () => {
      return dispatch({
        type: DELETE_FILE,
        fileId: ownProps.context
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFileDialog);
