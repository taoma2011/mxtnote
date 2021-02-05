/* eslint-disable no-underscore-dangle */
import { connect } from 'react-redux';
import NoteEditor from '../components/NoteEditor';
import { EDIT_TEXT_CHANGED2, TODO_DEPENDENCY_CHANGE } from '../actions/file';
import { isNewNote } from '../utils/common';

// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
  const { file } = state;
  const { notes } = file || {};
  const nid = file.editingNid;
  if (!nid) {
    return {};
  }

  let note;
  if (isNewNote(nid)) {
    note = file.rect;
  } else {
    note = notes[nid];
  }
  console.log('ne2: note is ', note);
  return {
    ...note,
    noteId: nid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleTextChange: event =>
      dispatch({
        type: EDIT_TEXT_CHANGED2,
        text: event.target.value
      }),
    handleDependencyChange: todoId =>
      dispatch({
        type: TODO_DEPENDENCY_CHANGE,
        todoId
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEditor);
