/* eslint-disable global-require */
/* eslint-disable promise/catch-or-return */
// import * as pdfjs from 'pdfjs-dist';

import { isWebApp } from './env';

export function findFileById(files, id) {
  for (let i = 0; i < files.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (files[i]._id === id) {
      return files[i];
    }
  }
  return null;
}

export function getFileId(file) {
  // eslint-disable-next-line no-underscore-dangle
  return file._id;
}

export function replaceFileById(files, id, newFile) {
  return files.map((file) => {
    if (getFileId(file) === id) {
      return newFile;
    }
    return file;
  });
}

export function getTodoId(todo) {
  // eslint-disable-next-line no-underscore-dangle
  return todo._id;
}

export function findTodoById(todos, id) {
  for (let i = 0; i < todos.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (todos[i]._id === id) {
      return todos[i];
    }
  }
  return null;
}

export function replaceTodoById(todos, id, newTodo) {
  return todos.map((todo) => {
    if (getTodoId(todo) === id) {
      return newTodo;
    }
    return todo;
  });
}

export const newNoteId = 'new';
export function isNewNote(id) {
  return id === newNoteId;
}

export function getNoteId(note) {
  // eslint-disable-next-line no-underscore-dangle
  if (note._id) {
    // eslint-disable-next-line no-underscore-dangle
    return note._id;
  }
  return note.id;
}

export function findNoteById(notes, id) {
  return notes[id];
}

export function replaceNoteById(notes, id, newNote) {
  return {
    ...notes,
    [id]: newNote,
  };
}

export function scaleRect(rect, decimalScale0) {
  //const decimalScale = decimalScale0 * 2.0;
  const decimalScale = decimalScale0;
  return {
    top: rect.top * decimalScale,
    left: rect.left * decimalScale,
    width: rect.width * decimalScale,
    height: rect.height * decimalScale,
  };
}

export function getElectron() {
  /* WEB-INT */
  if (isWebApp()) {
    return null;
  }
  // this is so that it works for next.js
  return eval("require('electron')");
}

export function getFs() {
  /* WEB-INT */
  if (isWebApp()) {
    return null;
  }
  // this is so that it works for next.js
  return eval("require('fs')");
}

export function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function toggleTodoDependency(dataApi, noteId, todoId) {
  const note = dataApi.GetNoteById(noteId);
  console.log('todo dependency change: original note is ', note);
  const newDependency = note.todoDependency ? [...note.todoDependency] : [];

  const i = newDependency.indexOf(todoId);
  if (i === -1) {
    newDependency.push(todoId);
  } else {
    newDependency.splice(i, 1);
  }

  console.log('new dependency ', newDependency);

  const newNote = { ...note };
  newNote.todoDependency = newDependency;
  return newNote;
}

export function compareDate(a, b) {
  // console.log(`compare ${a} with ${b}`);
  const da = Date.parse(a);
  const db = Date.parse(b);
  const result = db - da;
  // console.log(`result is ${result}`);
  return result;
}

export function getDataApiFromThunk(thunkAPI) {
  const fileState = thunkAPI.getState().file;
  const { dataApi } = fileState;
  return dataApi;
}
