import { connect } from 'react-redux';
import { CLOSE_NOTE_EDITOR } from '../actions/file';
// import { isNewNote } from '../utils/common';
import NoteEditorDialog from '../components/NoteEditorDialog';

function mapStateToProps(state) {
  const { file } = state;
  const { editingNid } = file;
  if (!editingNid) {
    return { open: false };
  }
  return {
    open: file.showNoteEditor || false,
    noteId: editingNid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch({ type: CLOSE_NOTE_EDITOR })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditorDialog);
