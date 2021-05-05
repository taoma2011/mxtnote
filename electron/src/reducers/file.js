/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
// @flow
import {
  OPEN_GIVEN_FILE,
  PREV_PAGE,
  NEXT_PAGE,
  FILE_LOADED,
  PAGE_LOADED,
  PAGE_SCROLL_NOTIFY,
  PAGE_SIZE_READY,
  SET_RECT_STATE,
  START_ADD_NOTE,
  ADD_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  GOTO_NOTE,
  FINALIZE_NOTE,
  SET_TAB,
  ADD_NOTE_FROM_DB,
  // library
  ADD_FILE,
  ADD_FILE_FROM_DB,
  DELETE_FILE,
  // todo
  ADD_TODO,
  ADD_TODO_FROM_DB,
  DELETE_TODO,
  TOGGLE_TODO_DONE,
  TODO_DEPENDENCY_CHANGE,
  EDIT_TEXT_CHANGED2,
  SCALE_CHANGED,
  START_EDIT_LIBRARY,
  END_EDIT_LIBRARY,
  DOCUMENT_DESCRIPTION_CHANGED,
  START_EDIT_TODO,
  END_EDIT_TODO,
  TODO_DESCRIPTION_CHANGED,
  START_DELETE_TODO,
  CANCEL_DELETE_TODO,
  START_DELETE_FILE,
  CANCEL_DELETE_FILE,
  START_DELETE_NOTE,
  CANCEL_DELETE_NOTE,
  SET_NOTE_TODO_FILTER,
  SET_PAGE_NUMBER,
  IMPORT_NOTE_FROM_REMOTE,
  IMPORT_NOTE,
  EXPORT_NOTE,
  BACKUP_DB,
  OPEN_RESET_CONFIRM_DIALOG,
  CLOSE_RESET_CONFIRM_DIALOG,
  IMAGE_DATA_READY,
  IMAGE_FILE_READY,
  CLOSE_NOTE_EDITOR,
  OPEN_NOTE_EDITOR,
  RESOLVE_CONFLICT,
  RESOLVE_DONE,
  SYNC_PROGRESS,
  SYNC_DONE,
  SET_API_STATE,
} from '../actions/file';

import { updateNote } from '../actions/ActionCreators';

import { SetFileScale, SetFileLastPage } from '../utils/db';
/*
import {
  AddDocument,
  UpdateDocument,
  DeleteDocument,
  UpdateTodo,
  DeleteTodo,
  UpdateNote,
  DeleteNote,
  SetScale,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  DeleteSettings,
  GetAllDocumentsPromise,
  GetAllNotesPromise,
  GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
} from "../utils/db";
*/

import { getDataApi } from '../utils/tsapi';
import { isWebApp, isUseLocalDataApi, getInitialToken } from '../utils/env';
import {
  findFileById,
  replaceFileById,
  findTodoById,
  replaceTodoById,
  getNoteId,
  getFileId,
  getTodoId,
  findNoteById,
  replaceNoteById,
  scaleRect,
  isNewNote,
  generateId,
  getElectron,
  getFs,
} from '../utils/common';

function saveLastPageNumber(dataApi, state) {
  console.log(
    `save file ${state.currentFile.id} to page ${state.currentPageNum}`
  );
  SetFileLastPage(state.currentFile.id, state.currentPageNum);
}

// return new state to indicate whether we are editing a note
// if editingNid is null, we are not editing anything
function setEditingNid(state, editingNid) {
  if (state.editingNid) {
    // TODO need to commit the current change
  }

  return {
    ...state,
    editingNid,
    showSelection: !!editingNid,
  };
}

function exportStateToFile(dataApi, state, f) {
  // eslint-disable-next-line global-require

  const { remote } = getElectron();
  const fs = remote.require('fs');
  console.log('before write file');

  const saveObjects = {
    files: dataApi.GetCachedDocuments(),
    notes: dataApi.GetCachedNotes(),
    todos: dataApi.GetCachedTodos(),
  };
  try {
    fs.writeFileSync(f, JSON.stringify(saveObjects, null, 2), 'utf-8');
  } catch (e) {
    console.log('Failed to save the file: ', e);
  }
}

export function getInitialState() {
  const dataApi = getDataApi(isUseLocalDataApi());
  const apiState = dataApi.Initialize(getInitialToken());

  return {
    currentTab: 2,
    files: [],
    currentFile: null,
    pageNum: 1,
    libraryLoaded: false,
    scale: 100,
    settingsLoaded: false,
    openResetConfirmDialog: false,
    apiState,
    dataApi,
    isWeb: isWebApp(),
  };
}

export default function file(state, action) {
  if (!state) {
    return getInitialState();
  }
  const { dataApi } = state;
  // console.log("action is ", action);
  switch (action.type) {
    // user click on a document from library page
    case OPEN_GIVEN_FILE: {
      if (
        state.currentFile !== null &&
        action.file === state.currentFile.fileName
      ) {
        return {
          ...state,
          currentTab: 0,
        };
      }

      let pageNum = 1;
      let { scale } = state;
      if (action.settings) {
        const { lastPage, lastScale } = action.settings;
        if (lastPage) {
          pageNum = lastPage;
        }
        if (lastScale) {
          scale = lastScale;
        }
      }

      return {
        ...state,
        documentLoaded: false,
        currentFile: action.file,
        // this fileId field is obsolete?
        fileId: action.fileId,
        pageNum,
        scale,
        currentPageNum: pageNum,
        currentTab: 0,
      };
    }
    case FILE_LOADED: {
      return {
        ...state,
        documentLoaded: true,
        doc: action.doc,
        numPages: action.doc.numPages,
        // page width/height will be known after one page is loaded
        pageWidth: 0,
        pageHeight: 0,
      };
    }
    case NEXT_PAGE: {
      if (!state.pageNum || state.pageNum >= state.numPages) {
        return state;
      }
      const newState = {
        ...state,
        pageNum: state.currentPageNum + 1,
        pageNumIsEffective: true,
        currentPageNum: state.currentPageNum + 1,
      };
      saveLastPageNumber(dataApi, newState);
      return newState;
    }
    case PREV_PAGE: {
      if (!state.pageNum || state.currentPageNum <= 1) {
        return state;
      }
      const newState = {
        ...state,
        pageNum: state.currentPageNum - 1,
        pageNumIsEffective: true,
        currentPageNum: state.currentPageNum - 1,
      };
      saveLastPageNumber(dataApi, newState);
      return newState;
    }
    case SET_PAGE_NUMBER: {
      const page = Number(action.page);
      if (page < 1 || page > state.numPages) {
        console.log('invalid page ', page, state.pageNum);
        return state;
      }
      const newState = {
        ...state,
        pageNum: page,
        pageNumIsEffective: true,
        currentPageNum: page,
      };
      saveLastPageNumber(dataApi, newState);
      return newState;
    }
    case PAGE_SCROLL_NOTIFY: {
      const newState = {
        ...state,
        pageNumIsEffective: false,
        currentPageNum: action.page,
      };
      saveLastPageNumber(dataApi, newState);
      return newState;
    }
    case PAGE_LOADED: {
      return {
        ...state,
        page: action.page,
      };
    }
    case PAGE_SIZE_READY: {
      return {
        ...state,
        pageWidth: action.pageWidth,
        pageHeight: action.pageHeight,
      };
    }
    case SET_RECT_STATE: {
      const note = dataApi.GetNoteById(state.editingNid);
      const newRect = scaleRect(
        {
          top: action.top,
          left: action.left,
          width: action.width,
          height: action.height,
        },
        100 / state.scale
      );
      // dataApi.UpdateNote(state.editingNid, note);
      return {
        ...state,
        pendingNid: state.editingNid,
        rect: newRect,
      };
    }

    case ADD_NOTE_FROM_DB: {
      // here we store the ui state of the note
      const noteMap = {};
      if (!action.notes) {
        return state;
      }
      action.notes.forEach((n) => {
        noteMap[getNoteId(n)] = n;
      });
      return {
        ...state,
        notes: noteMap,
        noteLoaded: true,
      };
    }

    case START_ADD_NOTE:
      return {
        ...state,
        addingNote: true,
      };
    case ADD_NOTE: {
      // now we come here only when note is added
      const now = new Date();

      const { newNid, note } = action;
      const newRect = {
        top: note.top,
        left: note.left,
        width: note.width,
        height: note.height,
      };
      return {
        ...state,
        rect: newRect,
        editingNid: newNid,
        showSelection: true,
      };
    }
    case EDIT_NOTE: {
      // start to edit a note
      const n = dataApi.GetNoteById(action.nid);

      if (!n) {
        console.log('cannot get editing note: ', action.nid);
        return state;
      }

      return {
        ...state,
        rect: {
          left: n.left,
          top: n.top,
          width: n.width,
          height: n.height,
          text: n.text,
        },
        showSelection: true,
        editingNid: action.nid,
      };
    }
    case GOTO_NOTE: {
      const n = action.note;
      if (
        state.currentFile !== null &&
        action.file.id === state.currentFile.id
      ) {
        // just go to page for now
        return {
          ...state,
          pageNum: n.page,
          currentPageNum: n.page,
          // goto file tab
          currentTab: 0,
        };
      }

      return {
        ...state,
        currentFile: action.file,
        documentLoaded: false,
        pageNum: n.page,
        currentPageNum: n.page,
        // goto file tab
        currentTab: 0,
      };
    }

    case IMAGE_FILE_READY: {
      const n = state.notes[action.noteId];
      if (!n) {
        console.log('reducer: image file ready invalid noteId ', action.noteId);
        return state;
      }
      const newNote = {
        ...n,
        imageFile: action.file,
      };
      console.log('update image file: ', action.file);
      dataApi.UpdateNote(getNoteId(n), newNote);
      return {
        ...state,
        notes: {
          ...state.notes,
          [getNoteId(n)]: newNote,
        },
      };
    }
    case IMAGE_DATA_READY: {
      const n = state.notes[action.noteId];
      if (!n) {
        console.log('reducer: image data ready invalid nodeId ', action.noteId);
        return state;
      }
      const newNote = {
        ...n,
        image: action.buffer,
      };
      return {
        ...state,
        notes: {
          ...state.notes,
          [getNoteId(n)]: newNote,
        },
      };
    }
    case FINALIZE_NOTE: {
      console.log('finialize ', state.editingNid);

      return {
        ...state,
        editingNid: null,
        showSelection: false,
      };
    }

    case SET_TAB: {
      let newState = {
        ...state,
        currentTab: action.tab,
      };
      newState = setEditingNid(newState, null);
      return newState;
    }
    case ADD_FILE: {
      /*
      const newFile = {
        file: action.file,
        description: action.description,
        content: action.content,
      };
      dataApi.AddDocument(newFile);
      */
      return {
        ...state,
        files: [],
        libraryLoaded: false,
      };
    }
    case ADD_FILE_FROM_DB: {
      console.log('get add file from db');
      return {
        ...state,
        files: [...action.files],
        libraryLoaded: true,
      };
    }
    case DELETE_FILE: {
      // dataApi.DeleteDocumentByFileId(action.fileId);
      return state;
    }
    case ADD_TODO: {
      const newTodo = {
        description: action.description,
      };
      dataApi.UpdateTodo(null, newTodo);
      return {
        ...state,
        todos: [],
        todoLoaded: false,
      };
    }
    case ADD_TODO_FROM_DB: {
      // console.log("get add todo from db");

      return {
        ...state,
        todos: [...action.todos],
        todoDependency: [],
        todoLoaded: true,
      };
    }
    case DELETE_TODO: {
      dataApi.DeleteTodo(action.todoId);
      return {
        ...state,
        todos: [],
        todoLoaded: false,
      };
    }
    case TOGGLE_TODO_DONE: {
      const todo = findTodoById(state.todos, action.todoId);
      if (!todo) {
        return state;
      }
      const newTodo = {
        ...todo,
        done: !todo.done,
      };
      dataApi.UpdateTodo(action.todoId, newTodo);
      const newTodoList = replaceTodoById(state.todos, action.todoId, newTodo);
      return {
        ...state,
        todos: newTodoList,
      };
    }
    case TODO_DEPENDENCY_CHANGE: {
      const note = dataApi.GetNoteById(state.editingNid);
      console.log('todo dependency change: original note is ', note);
      const newDependency = note.todoDependency ? [...note.todoDependency] : [];

      const i = newDependency.indexOf(action.todoId);
      if (i === -1) {
        newDependency.push(action.todoId);
      } else {
        newDependency.splice(i, 1);
      }

      console.log('new dependency ', newDependency);

      const newNote = { ...note };
      newNote.todoDependency = newDependency;
      dataApi.UpdateNote(getNoteId(note), newNote);
      return {
        ...state,
        notes: {
          ...state.notes,
          [getNoteId(note)]: newNote,
        },
      };
    }

    case EDIT_TEXT_CHANGED2: {
      if (isNewNote(state.editingNid)) {
        return {
          ...state,
          rect: {
            ...state.rect,
            text: action.text,
          },
        };
      }
      const note = state.notes[state.editingNid];

      const newNote = {
        ...note,
        text: action.text,
        // lastModified: Date.now(),
        lastModified: new Date(),
      };
      dataApi.UpdateNote(state.editingNid, newNote);
      return {
        ...state,
        notes: {
          ...state.notes,
          [state.editingNid]: newNote,
        },
      };
    }
    case SCALE_CHANGED: {
      console.log('setting scale to ', action.scale);
      SetFileScale(state.currentFile.id, action.scale);

      return {
        ...state,
        scale: action.scale,
        settingsLoaded: true,
      };
    }

    case START_EDIT_LIBRARY: {
      return {
        ...state,
        editingFileId: action.fileId,
      };
    }
    case END_EDIT_LIBRARY: {
      return {
        ...state,
        editingFileId: null,
      };
    }

    case START_EDIT_TODO: {
      const editingTodo = findTodoById(state.todos, action.todoId);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...editingTodo,
        editing: true,
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case END_EDIT_TODO: {
      const editingTodo = findTodoById(state.todos, action.todoId);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...editingTodo,
        editing: false,
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case TODO_DESCRIPTION_CHANGED: {
      const editingTodo = findTodoById(state.todos, action.todoId);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...editingTodo,
        description: action.description,
      });
      return {
        ...state,
        todos: newTodos,
      };
    }

    case START_DELETE_TODO: {
      const deletingTodo = findTodoById(state.todos, action.todoId);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...deletingTodo,
        deleting: true,
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case CANCEL_DELETE_TODO: {
      const deletingTodo = findTodoById(state.todos, action.todoId);
      console.log('handle cancel delete, ', deletingTodo);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...deletingTodo,
        deleting: false,
      });
      console.log('new todos ', newTodos);
      return {
        ...state,
        todos: newTodos,
      };
    }
    case START_DELETE_FILE: {
      return {
        ...state,
        deletingFileId: action.fileId,
      };
    }
    case CANCEL_DELETE_FILE: {
      return {
        ...state,
        deletingFileId: null,
      };
    }
    case START_DELETE_NOTE: {
      return {
        ...state,
        deletingNid: action.noteId,
      };
    }
    case CANCEL_DELETE_NOTE: {
      return {
        ...state,
        deletingNid: null,
      };
    }
    case DELETE_NOTE: {
      console.log('deleting note ', action.noteId);

      // this is now done in backendSlice
      //dataApi.DeleteNote(action.noteId);
      return {
        ...state,
        editingNid: null,
        deletingNid: null,
        noteLoaded: false,
        notes: {},
        showSelection: false,
      };
    }
    case SET_NOTE_TODO_FILTER: {
      const filterTodoId = action.todoId === 'none' ? null : action.todoId;
      return {
        ...state,
        noteTodoFilter: filterTodoId,
      };
    }
    case IMPORT_NOTE_FROM_REMOTE: {
      console.log('contact remote');

      // doImport();
      return {
        ...state,
        files: [],
        libraryLoaded: false,
        notes: {},
        noteLoaded: false,
        todos: [],
        todoLoaded: false,
      };
    }
    case IMPORT_NOTE: {
      const { content } = action;
      if (content) {
        console.log('content is ', content);
        try {
          const obj = JSON.parse(content);
          obj.files.forEach((doc) =>
            dataApi.UpdateDocument(getFileId(doc), doc)
          );
          obj.notes.forEach((note) =>
            dataApi.UpdateNote(getNoteId(note), note)
          );
          obj.todos.forEach((todo) =>
            dataApi.UpdateTodo(getTodoId(todo), todo)
          );
          return {
            ...state,
            files: [],
            libraryLoaded: false,
            notes: {},
            noteLoaded: false,
            todos: [],
            todoLoaded: false,
          };
        } catch (err) {
          console.log(err);
        }
      }

      return state;
    }
    case EXPORT_NOTE: {
      console.log('export notes');
      // eslint-disable-next-line global-require
      const { remote } = getElectron();
      const f = remote.dialog.showSaveDialogSync();

      if (f) {
        exportStateToFile(dataApi, state, f);
      }
      return state;
    }
    case BACKUP_DB: {
      console.log('backup db');
      exportStateToFile(dataApi, state, 'db_backup.json');
      return state;
    }
    case OPEN_RESET_CONFIRM_DIALOG: {
      return {
        ...state,
        openResetConfirmDialog: true,
      };
    }
    case CLOSE_RESET_CONFIRM_DIALOG: {
      if (action.confirmed) {
        dataApi.DeleteAllDocuments();
        dataApi.DeleteAllNotes();
        dataApi.DeleteAllTodos();
        dataApi.DeleteSettings();
        return {
          ...state,
          notes: {},
          files: [],
          todos: [],
          scale: 100,
          noteLoaded: false,
          todoLoaded: false,
          libraryLoaded: false,
          openResetConfirmDialog: false,
        };
      }
      return {
        ...state,
        openResetConfirmDialog: false,
      };
    }
    case CLOSE_NOTE_EDITOR: {
      return {
        ...state,
        showNoteEditor: false,
      };
    }
    case OPEN_NOTE_EDITOR: {
      return {
        ...state,
        editingNid: action.noteId,
        showNoteEditor: true,
      };
    }
    case RESOLVE_CONFLICT: {
      return {
        ...state,
        showResolveConflictDialog: true,
        resolveConflictLocal: action.localNote,
        resolveConflictRemote: action.remoteNote,
        remoteDb: action.remoteDb,
        currentIndex: action.currentIndex,
      };
    }
    case RESOLVE_DONE: {
      return {
        ...state,
        showResolveConflictDialog: false,
      };
    }
    case SYNC_PROGRESS: {
      return {
        ...state,
        showSyncProgress: true,
        syncProgress: action.progress,
      };
    }
    case SYNC_DONE: {
      return {
        ...state,
        showSyncProgress: false,
      };
    }
    case SET_API_STATE: {
      const newState = {
        ...state,
        apiState: action.apiState,
      };
      if (action.apiState === 'ok') {
        newState.dataApi = action.dataApi;
      }
      return newState;
    }
    default:
      return state;
  }
}
