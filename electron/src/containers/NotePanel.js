/* eslint-disable no-underscore-dangle */
import { connect } from 'react-redux';
import NotePanel from '../components/NotePanel';
import {
  GOTO_NOTE,
  START_DELETE_NOTE,
  OPEN_NOTE_EDITOR,
  CLOSE_NOTE_EDITOR,
} from '../actions/file';
import { findFileById } from '../utils/common';

// obsolete
// eslint-disable-next-line no-unused-vars
function mapStateToProps(state, ownProp) {
  const { file } = state;
  const { notes } = file || {};

  if (notes) {
    const note = notes[ownProp.nid];
    const { fileId } = note;
    const noteFile = findFileById(file.files, fileId);
    let noteContext = 'missing context';
    if (noteFile) {
      noteContext = `${noteFile.description}, page ${note.page}`;
    }

    return { ...note, noteContext, noteId: note._id };
  }
  return {};
}

function mapDispatchToProps(dispatch, ownProp) {
  return {
    gotoNote: () =>
      dispatch({
        type: GOTO_NOTE,
        // TODO change to noteId
        nid: ownProp.nid,
      }),
    startDeleteNote: () =>
      dispatch({
        type: START_DELETE_NOTE,
        noteId: ownProp.nid,
      }),
    openNoteEditor: (noteId) =>
      dispatch({
        type: OPEN_NOTE_EDITOR,
        noteId,
      }),
    closeNoteEditor: () =>
      dispatch({
        type: CLOSE_NOTE_EDITOR,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotePanel);
