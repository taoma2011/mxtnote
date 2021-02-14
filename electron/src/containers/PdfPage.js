import { connect } from "react-redux";
import PdfPage from "../components/PdfPage";
import { RENDER_COMPLETE, ADD_NOTE, PAGE_SIZE_READY } from "../actions/file";

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { page, scale, addingNote } = file || {};
  return {
    //pdfPage: page,
    scale,
    addingNote,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    notifyRenderComplete: (canvas) =>
      dispatch({ type: RENDER_COMPLETE, canvas }),
    notifyPageSizeReady: (pageWidth, pageHeight) =>
      dispatch({ type: PAGE_SIZE_READY, pageWidth, pageHeight }),
    addNoteAt: (e) =>
      dispatch({
        type: ADD_NOTE,
        // not sure why we need to -100?
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PdfPage);