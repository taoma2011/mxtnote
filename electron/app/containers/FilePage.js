import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { sizing } from "@material-ui/system";
import { FilePage } from "../components/FilePage";
import * as FileActions from "../actions/file";

// this file is not used now
// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const {
    notes,
    pageNum,
    numPages,
    fileId,
    doc,
    docLoading,
    noteLoaded,
    pageWidth,
    pageHeight,
  } = file || {};
  return {
    doc,
    docLoading,
    pageNum,
    numPages,
    fileId,
    notes,
    noteLoaded,
    pageWidth,
    pageHeight,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(FileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilePage);
