import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { sizing } from '@material-ui/system';
import FilePage from '../components/FilePage';
import * as FileActions from '../actions/file';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { notes, pageNum, fileId, docLoading, noteLoaded } = file || {};
  return {
    docLoading,
    pageNum,
    fileId,
    notes,
    noteLoaded
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(FileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilePage);
