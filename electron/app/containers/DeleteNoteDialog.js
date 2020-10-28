import { connect } from "react-redux";
import { CANCEL_DELETE_NOTE, DELETE_NOTE } from "../actions/file";
import DeleteNoteDialog from "../components/DeleteNoteDialog";
import { findNoteById } from "../utils/common";

function mapStateToProps(state, ownProps) {
  const { file } = state;
  const { notes } = file || {};
  let nid = ownProps.context;

  // either use the dom attribute "context" or the "deletingNid" field in state
  if (!nid) {
    nid = file.deletingNid;
  }
  const deletingNote = findNoteById(notes, nid);
  if (!deletingNote) {
    return {
      deleting: false,
    };
  }
  //console.log('delete note dialog nid = ', nid, deletingNote);
  const deleting = Boolean(deletingNote.deleting);
  return {
    deleting,
    noteId: nid,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: (noteId) => {
      return dispatch({
        type: CANCEL_DELETE_NOTE,
        noteId,
      });
    },
    deleteNote: (noteId) => {
      return dispatch({
        type: DELETE_NOTE,
        noteId,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteNoteDialog);
