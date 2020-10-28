import { bindActionCreators } from "redux";
import { connect } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { sizing } from "@material-ui/system";
import { NotePage } from "../components/NotePage";
import * as FileActions from "../actions/file";

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { notes, noteLoaded, noteTodoFilter } = file || {};
  const noteArray = [];
  Object.keys(notes).forEach((key) => {
    noteArray.push(notes[key]);
  });
  //console.log("notes before filter ", notes);
  //console.log("filter is ", noteTodoFilter);
  const noteArrayFiltered = noteTodoFilter
    ? noteArray.filter((n) => {
        return (
          n.todoDependency && n.todoDependency.indexOf(noteTodoFilter) !== -1
        );
      })
    : noteArray;
  //console.log("notes after filter ", noteArrayFiltered);
  const noteArraySorted = noteArrayFiltered.sort(function(n1, n2) {
    const t1 = n1.lastModified || 0;
    const t2 = n2.lastModified || 0;
    return t2 - t1;
  });

  const noteSummaryArray = noteArraySorted.map((n) => {
    return {
      _id: n._id,
      height: n.height,
      scale: n.scale,
    };
  });
  return { notes: noteSummaryArray, noteLoaded };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(FileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePage);
