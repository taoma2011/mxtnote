import { createAsyncThunk } from '@reduxjs/toolkit';
import * as FileActions from './file';

export const DeleteNote = (noteId) => {
  return {
    type: FileActions.DELETE_NOTE,
    noteId,
  };
};

// in the file page, show note rectangle as selectable
export const EditNote = (noteId) => {
  return {
    type: FileActions.EDIT_NOTE,
    nid: noteId,
  };
};

export const OpenDeleteNoteDialog = (noteId) => {
  return {
    type: FileActions.START_DELETE_NOTE,
    noteId,
  };
};
export const CloseDeleteNoteDialog = () => {
  return {
    type: FileActions.CANCEL_DELETE_NOTE,
  };
};

export const OpenEditNoteDialog = (noteId) => {
  return {
    type: FileActions.OPEN_NOTE_EDITOR,
    noteId,
  };
};
export const CloseEditNoteDialog = () => {
  return {
    type: FileActions.CLOSE_NOTE_EDITOR,
  };
};

export const TodoDependencyChange = (todoId) => {
  return {
    type: FileActions.TODO_DEPENDENCY_CHANGE,
    todoId,
  };
};
export const setRectState = (rect) => {
  const { top, left, width, height, angle } = rect;
  return {
    type: FileActions.SET_RECT_STATE,
    top,
    left,
    width,
    height,
    angle,
  };
};
