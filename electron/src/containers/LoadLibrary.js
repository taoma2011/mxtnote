import { connect } from 'react-redux';
import LoadLibrary from '../components/LoadLibrary2';
import { ADD_FILE_FROM_DB } from '../actions/file';

/* this has been replaced with LoadLibrary2 */

function mapDispatchToProps(dispatch) {
  return {
    addFiles: (docs) =>
      dispatch({
        type: ADD_FILE_FROM_DB,
        files: docs,
      }),
  };
}

export default connect(null, mapDispatchToProps)(LoadLibrary);
