import { connect } from 'react-redux';
import { ADD_FILE } from '../actions/file';
import LibraryControl from '../components/LibraryControl';

// obsolete
function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    addFileToLibrary: (fileName, description) => {
      return dispatch({
        type: ADD_FILE,
        file: fileName,
        description,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryControl);
