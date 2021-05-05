import { connect } from 'react-redux';
import LoadFile from '../components/LoadFile';
import { FILE_LOADED } from '../actions/file';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  console.log('in load file container');
  const file = state.file || {};
  return {
    pdfFile: file.fileName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    documentLoaded: (pdfDoc) =>
      dispatch({
        type: FILE_LOADED,
        doc: pdfDoc,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadFile);
