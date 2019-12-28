import { connect } from 'react-redux';
import {
  END_EDIT_LIBRARY,
  DOCUMENT_DESCRIPTION_CHANGED
} from '../actions/file';
import EditLibraryDialog from '../components/EditLibraryDialog';
import { findFileById } from '../utils/common';

function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { files } = file || {};
  const fid = ownProps.context;
  const editingFile = findFileById(files, fid);
  const editing = Boolean(editingFile.editing);
  return {
    editing,
    description: editingFile.description
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleClose: () => {
      return dispatch({
        type: END_EDIT_LIBRARY,
        fileId: ownProps.context
      });
    },
    handleDescriptionChange: e => {
      return dispatch({
        type: DOCUMENT_DESCRIPTION_CHANGED,
        fileId: ownProps.context,
        description: e.target.value
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLibraryDialog);
