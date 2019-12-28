import { connect } from 'react-redux';
import NoteEditorControl from '../components/NoteEditorControl';
import {
  OPEN_NOTE_EDITOR,
  FINALIZE_NOTE,
  START_DELETE_NOTE
} from '../actions/file';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { rect } = file || {};
  console.log('note editor, rect is ', rect);
  return {
    editingNid: file.editingNid,
    editingText: (rect || {}).text
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openNoteEditor: noteId =>
      dispatch({
        type: OPEN_NOTE_EDITOR,
        noteId
      }),
    finalizeEdit: () =>
      dispatch({
        type: FINALIZE_NOTE
      }),
    deleteNote: noteId => {
      return dispatch({
        type: START_DELETE_NOTE,
        noteId
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditorControl);
