import { connect } from 'react-redux';
import LoadPage from '../components/LoadPage';
import { PAGE_LOADED } from '../actions/file';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const file = state.file || {};
  console.log('doc is ', file.doc);
  return {
    pdfDoc: file.doc,
    pageNum: file.pageNum
  };
}

function mapDispatchToProps(dispatch) {
  return {
    pageLoaded: pdfPage =>
      dispatch({
        type: PAGE_LOADED,
        page: pdfPage
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadPage);
