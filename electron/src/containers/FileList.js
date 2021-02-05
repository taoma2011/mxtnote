import { connect } from 'react-redux';
import FileList from '../components/FileList';
import {
  OPEN_GIVEN_FILE,
  START_DELETE_FILE,
  START_EDIT_LIBRARY
} from '../actions/file';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state, ownProp) {
  const { file } = state;
  const { files } = file || {};

  return {
    files: files || []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoFile: (file, fileId) =>
      dispatch({
        type: OPEN_GIVEN_FILE,
        file,
        fileId
      }),
    editFile: fileId => dispatch({ type: START_EDIT_LIBRARY, fileId }),
    deleteFile: fileId =>
      dispatch({
        type: START_DELETE_FILE,
        fileId
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList);
