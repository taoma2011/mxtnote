import { connect } from 'react-redux';
import {
  OPEN_FILE,
  NEXT_PAGE,
  PREV_PAGE,
  START_ADD_NOTE,
  SCALE_CHANGED,
  SET_PAGE_NUMBER,
} from '../actions/file';
import FileControl from '../components/FileControl';

function mapStateToProps(state) {
  const { file } = state;
  const { currentPageNum, scale } = file || {};
  return {
    apiState: file.apiState,
    dataApi: file.dataApi,
    pageNum: currentPageNum,
    scale,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openFile: () => dispatch({ type: OPEN_FILE }),
    nextPage: () => dispatch({ type: NEXT_PAGE }),
    prevPage: () => dispatch({ type: PREV_PAGE }),
    addNote: () => dispatch({ type: START_ADD_NOTE }),
    scaleChanged: (event, value) =>
      dispatch({ type: SCALE_CHANGED, scale: value }),
    textChanged: (e) =>
      dispatch({ type: SET_PAGE_NUMBER, page: e.target.value }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileControl);
