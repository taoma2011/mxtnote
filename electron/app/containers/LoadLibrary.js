import { connect } from 'react-redux';
import LoadLibrary from '../components/LoadLibrary';
import { ADD_FILE_FROM_DB } from '../actions/file';

function mapDispatchToProps(dispatch) {
  return {
    addFiles: docs =>
      dispatch({
        type: ADD_FILE_FROM_DB,
        files: docs
      })
  };
}

export default connect(null, mapDispatchToProps)(LoadLibrary);
