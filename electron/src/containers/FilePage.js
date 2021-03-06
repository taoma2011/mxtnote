import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { sizing } from '@material-ui/system';
import { FilePage } from '../components/FilePage';
import * as FileActions from '../actions/file';

// will be obsolete
// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file, search } = state;
  const {
    scale,
    pageNum,
    numPages,
    fileId,
    doc,
    docLoading,
    noteLoaded,
    pageWidth,
    pageHeight,
  } = file || {};
  const { searchResults } = search || {};

  let status = 'loading';
  let message;
  if (!doc) {
    message = 'loading document';
  } else {
    status = 'ready';
  }

  return {
    status,
    message,
    doc,
    docLoading,
    pageNum,
    numPages,
    fileId,
    scale,
    searchResults,
    noteLoaded,
    pageWidth,
    pageHeight,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(FileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilePage);
