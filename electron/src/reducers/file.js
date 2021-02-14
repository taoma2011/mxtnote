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
} from "../actions/file";
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
} from "../utils/common";

import {
  login,
  callLogin,
  callImportRemoteDb,
  callExportRemoteDb,
} from "../utils/api";
import { mergeVersions, newNode } from "../version/version";

export async function doSync(dispatch) {
  const currentDocs = await GetAllDocumentsPromise();
  const remoteDb = await callImportRemoteDb(currentDocs);
  //console.log("remote db: ", remoteDb);

  remoteDb.files.forEach((f) => {
    f._id = f.id;
    UpdateDocument(f.id, f);
  });

  remoteDb.deletedFiles.forEach((f) => {
    UpdateDocument(f._id, f);
  });

  return await mergeAndExport(remoteDb, 0, null);
}

//
// this function will be called when we start to merge,
// and every time after conflict is resolved manually
// it return the next action, which is either to complete
// the sync process, or prompt the user to resolve the
// current conflict
//
export async function mergeAndExport(remoteDb, currentIndex, resolveResult) {
  const syncTime = new Date();
  console.log("merging notes");

  let currentResolveResult = resolveResult;
  for (let i = currentIndex; i < remoteDb.notes.length; i++) {
    const n = remoteDb.notes[i];
    if (n.noteUuid) {
      console.log("checking note uuid ", n.noteUuid);
      const existingNote = await GetNoteByUuid(n.noteUuid);
      if (existingNote) {
        console.log("found existing node with uuid ", n.noteUuid);
        console.log("local sync record is ", existingNote.syncRecord);
        const localVersion = {
          lastModified: existingNote.lastModified,
          lastSynced: existingNote.lastSynced,
          tree: existingNote.syncRecord
            ? JSON.parse(existingNote.syncRecord)
            : null,
        };
        console.log("remote sync record is ", n.syncRecord);
        const remoteVersion = {
          lastModified: n.lastModifiedTime,
          lastSynced: n.lastSynced,
          tree: n.syncRecord ? JSON.parse(n.syncRecord) : null,
        };
        console.log("merging ", n.noteUuid);
        const res = mergeVersions(localVersion, remoteVersion);
        console.log("merge result ", res);
        if (res.status === "conflict") {
          console.log("cannot merge");
          // ask user to resolve conflict
          if (!currentResolveResult)
            return {
              type: RESOLVE_CONFLICT,
              localNote: existingNote,
              remoteNote: n,
              remoteDb: remoteDb,
              currentIndex: i,
            };
          const result = currentResolveResult;
          currentResolveResult = null;
          console.log("result is ", result);
          if (result === "local") {
            existingNote.lastSynced = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await UpdateNotePromise(existingNote._id, existingNote);
            continue;
          } else if (result === "remote") {
            Object.assign(existingNote, n);
            console.log("after merging with remote: ", existingNote);
            existingNote.lastSynced = syncTime;
            existingNote.lastModified = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await UpdateNotePromise(existingNote._id, existingNote);
            continue;
          } else {
            existingNote.conflict = true;
            await UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
        } else {
          if (res.status === "local") {
            // keep local version, create
            existingNote.lastSynced = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
          if (res.status === "remote") {
            Object.assign(existingNote, n);
            console.log("after merging with remote: ", existingNote);
            existingNote.lastSynced = syncTime;
            existingNote.lastModified = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
        }
      }
    }
    console.log("create new note ", n.id);
    n._id = n.id;
    n.lastSynced = syncTime;
    // convert to local field name/format
    n.lastModified = n.lastModifiedTime;
    await UpdateNotePromise(n.id, n);
  }
  remoteDb.todos.forEach((t) => {
    t._id = t.id;
    UpdateTodo(t.id, t);
  });

  /* export to remote db */
  const localFiles = await GetAllDocumentsPromise();

  // if there is no sync record, create one
  const localNotes = await GetAllNotesPromise();

  localNotes.forEach(async (n) => {
    if (!n.syncRecord) {
      n.lastSynced = syncTime;
      n.syncRecord = JSON.stringify(newNode());
      await UpdateNotePromise(n._id, n);
    }
  });

  const db = {
    files: localFiles,
    notes: localNotes,
    todos: await GetAllTodosPromise(),
  };
  await callExportRemoteDb(db);

  return {
    type: IMPORT_NOTE_FROM_REMOTE,
  };
}

function saveLastPageNumber(state) {
  const { files } = state;
  if (!files) {
    return state;
  }
  const f = findFileById(files, state.fileId);
  if (!f) {
    return state;
  }
  const updatedFile = {
    ...f,
    lastPageNumber: state.pageNum,
  };
  UpdateDocument(state.fileId, updatedFile);

  const updatedFiles = [...files];
  replaceFileById(updatedFiles, state.fileId, updatedFile);
  return {
    ...state,
    files: updatedFiles,
  };
}

// return new state to indicate whether we are editing a note
// if editingNid is null, we are not editing anything
function setEditingNid(state, editingNid) {
  // first make the current editing note visible
  let newNotes = { ...state.notes };
  if (state.editingNid) {
    newNotes = {
      ...newNotes,
      [state.editingNid]: { ...state.notes[state.editingNid], visible: true },
    };
  }
  if (editingNid) {
    newNotes = {
      ...newNotes,
      [editingNid]: { ...state.notes[editingNid], visible: false },
    };
  }
  return {
    ...state,
    editingNid,
    notes: newNotes,
    showSelection: !!editingNid,
  };
}

function exportStateToFile(state, f) {
  const { remote } = require("electron");
  const fs = remote.require("fs");
  console.log("before write file");

  // probaby add an option to save image files too
  const saveNotes = Object.values(state.notes).map((n) => ({
    ...n,
    image: null,
    imageFile: null,
  }));
  const saveObjects = {
    files: state.files,
    notes: saveNotes,
    todos: state.todos,
  };
  try {
    fs.writeFileSync(f, JSON.stringify(saveObjects, null, 2), "utf-8");
  } catch (e) {
    console.log("Failed to save the file: ", e);
  }
}

export default function file(state, action) {
  if (!state) {
    return {
      currentTab: 2,
      files: [],
      fileName: "",
      pageNum: 1,
      libraryLoaded: false,
      scale: 100,
      settingsLoaded: false,
      openResetConfirmDialog: false,
    };
  }
  //console.log("action is ", action);
  switch (action.type) {
    // user click on a document from library page
    case OPEN_GIVEN_FILE: {
      if (action.file === state.fileName) {
        return {
          ...state,
          currentTab: 0,
        };
      }
      // see if there is a saved page number
      const { files } = state;
      const f = findFileById(files, action.fileId);
      let pageNum = 1;
      if (f && f.lastPageNumber) {
        pageNum = f.lastPageNumber;
      }
      return {
        ...state,
        docLoading: true,
        fileName: action.file,
        fileId: action.fileId,
        pageNum,
        currentPageNum: pageNum,
        currentTab: 0,
      };
    }
    case FILE_LOADED: {
      return {
        ...state,
        docLoading: false,
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
        currentPageNum: state.currentPageNum + 1,
      };
      return saveLastPageNumber(newState);
    }
    case PREV_PAGE: {
      if (!state.pageNum || state.currentPageNum <= 1) {
        return state;
      }
      const newState = {
        ...state,
        pageNum: state.currentPageNum - 1,
        currentPageNum: state.currentPageNum - 1,
      };
      return saveLastPageNumber(newState);
    }
    case SET_PAGE_NUMBER: {
      const page = Number(action.page);
      if (page < 1 || page > state.numPages) {
        console.log("invalid page ", page, state.pageNum);
        return state;
      }
      const newState = {
        ...state,
        pageNum: page,
        currentPageNum: page,
      };
      return saveLastPageNumber(newState);
    }
    case PAGE_SCROLL_NOTIFY: {
      // TODO: update the file last page
      return {
        ...state,
        currentPageNum: action.page,
      };
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
      const note = state.notes[state.editingNid];
      const newRect = scaleRect(
        {
          top: action.top,
          left: action.left,
          width: action.width,
          height: action.height,
        },
        100 / state.scale
      );
      UpdateNote(state.editingNid, note);
      return {
        ...state,
        notes: {
          ...state.notes,
          [state.editingNid]: {
            ...note,
            ...newRect,
          },
        },
      };
    }

    case ADD_NOTE_FROM_DB: {
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
      let newNid = generateId();
      while (state.notes[newNid]) newNid = generateId;

      console.log("adding new note ", newNid);

      const now = new Date();

      const defaultNote = {
        _id: newNid,
        fileId: state.fileId,
        page: state.pageNum,
        width: 100,
        height: 100,
        top: (action.y * 100) / state.scale,
        left: (action.x * 100) / state.scale,
        angle: 0,
        text: "new note",
        todoDependency: [],
        scale: state.scale,
        image: null,
        imageFile: null,
        created: now,
        lastModified: now,
      };

      UpdateNote(newNid, defaultNote);
      return {
        ...state,
        notes: {
          ...state.notes,
          [newNid]: defaultNote,
        },
        editingNid: newNid,
        showSelection: true,
      };
    }
    case EDIT_NOTE: {
      // start to edit a note
      const n = state.notes[action.nid];
      if (!n) {
        return state;
      }
      const newNotes = {
        ...state.notes,
      };
      newNotes[action.nid] = {
        ...n,
        visible: false,
      };
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
        notes: newNotes,
      };
    }
    case GOTO_NOTE: {
      const n = state.notes[action.nid];
      if (!n) {
        console.log("cannot find this note ", action.nid);
        return state;
      }
      if (n.fileId === state.fileId) {
        // just go to page for now
        return {
          ...state,
          pageNum: n.page,
          currentPageNum: n.page,
          // goto file tab
          currentTab: 0,
        };
      }
      // find the file name
      const { fileId } = n;
      let fileName = null;
      state.files.forEach((f) => {
        if (getFileId(f) === fileId) {
          fileName = f.file;
        }
      });
      if (!fileName) {
        console.log("cannot find file name for file ", fileId);
        return state;
      }
      return {
        ...state,
        fileId,
        fileName,
        docLoading: true,
        pageNum: n.page,
        currentPageNum: n.page,
        // goto file tab
        currentTab: 0,
      };
    }

    case IMAGE_FILE_READY: {
      const n = state.notes[action.noteId];
      if (!n) {
        console.log("reducer: image file ready invalid noteId ", action.noteId);
        return state;
      }
      const newNote = {
        ...n,
        imageFile: action.file,
      };
      console.log("update image file: ", action.file);
      UpdateNote(getNoteId(n), newNote);
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
        console.log("reducer: image data ready invalid nodeId ", action.noteId);
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
      console.log("finialize ", state.editingNid);

      const n = state.notes[state.editingNid];
      const newNote = {
        ...n,
        visible: true,
        image: null,
        imageFile: null,
      };
      // update db now so that previous imagefile is invalidated
      UpdateNote(getNoteId(newNote), newNote);

      return {
        ...state,
        notes: {
          ...state.notes,
          [getNoteId(n)]: newNote,
        },
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
      const newFile = {
        file: action.file,
        description: action.description,
      };
      AddDocument(newFile);
      return {
        ...state,
        files: [],
        libraryLoaded: false,
      };
    }
    case ADD_FILE_FROM_DB: {
      console.log("get add file from db");
      return {
        ...state,
        files: [...action.files],
        libraryLoaded: true,
      };
    }
    case DELETE_FILE: {
      DeleteDocument(action.fileId);
      return {
        ...state,
        files: [],
        libraryLoaded: false,
      };
    }
    case ADD_TODO: {
      const newTodo = {
        description: action.description,
      };
      UpdateTodo(null, newTodo);
      return {
        ...state,
        todos: [],
        todoLoaded: false,
      };
    }
    case ADD_TODO_FROM_DB: {
      //console.log("get add todo from db");

      return {
        ...state,
        todos: [...action.todos],
        todoDependency: [],
        todoLoaded: true,
      };
    }
    case DELETE_TODO: {
      DeleteTodo(action.todoId);
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
      UpdateTodo(action.todoId, newTodo);
      const newTodoList = replaceTodoById(state.todos, action.todoId, newTodo);
      return {
        ...state,
        todos: newTodoList,
      };
    }
    case TODO_DEPENDENCY_CHANGE: {
      const note = state.notes[state.editingNid];
      const newDependency = note.todoDependency ? [...note.todoDependency] : [];

      const i = newDependency.indexOf(action.todoId);
      if (i === -1) {
        newDependency.push(action.todoId);
      } else {
        newDependency.splice(i, 1);
      }
      console.log("context is ", action.context);
      console.log("new dependency ", newDependency);

      const newNote = { ...note };
      newNote.todoDependency = newDependency;
      UpdateNote(getNoteId(note), newNote);
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
        //lastModified: Date.now(),
        lastModified: new Date(),
      };
      UpdateNote(state.editingNid, newNote);
      return {
        ...state,
        notes: {
          ...state.notes,
          [state.editingNid]: newNote,
        },
      };
    }
    case SCALE_CHANGED: {
      console.log("setting scale to ", action.scale);
      SetScale(action.scale);

      return {
        ...state,
        scale: action.scale,
        settingsLoaded: true,
      };
    }

    case START_EDIT_LIBRARY: {
      const editingFile = findFileById(state.files, action.fileId);
      const newFiles = replaceFileById(state.files, action.fileId, {
        ...editingFile,
        editing: true,
      });
      return {
        ...state,
        files: newFiles,
      };
    }
    case END_EDIT_LIBRARY: {
      const editingFile = findFileById(state.files, action.fileId);
      const newFiles = replaceFileById(state.files, action.fileId, {
        ...editingFile,
        editing: false,
      });
      return {
        ...state,
        files: newFiles,
      };
    }
    case DOCUMENT_DESCRIPTION_CHANGED: {
      const editingFile = findFileById(state.files, action.fileId);
      const newFiles = replaceFileById(state.files, action.fileId, {
        ...editingFile,
        description: action.description,
      });
      return {
        ...state,
        files: newFiles,
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
      console.log("handle cancel delete, ", deletingTodo);
      const newTodos = replaceTodoById(state.todos, action.todoId, {
        ...deletingTodo,
        deleting: false,
      });
      console.log("new todos ", newTodos);
      return {
        ...state,
        todos: newTodos,
      };
    }
    case START_DELETE_FILE: {
      const deletingFile = findFileById(state.files, action.fileId);
      const newFiles = replaceFileById(state.files, action.fileId, {
        ...deletingFile,
        deleting: true,
      });
      return {
        ...state,
        files: newFiles,
      };
    }
    case CANCEL_DELETE_FILE: {
      const deletingFile = findFileById(state.files, action.fileId);
      console.log("handle cancel delete file, ", deletingFile);
      const newFiles = replaceFileById(state.files, action.fileId, {
        ...deletingFile,
        deleting: false,
      });
      console.log("new files ", newFiles);
      return {
        ...state,
        files: newFiles,
      };
    }
    case START_DELETE_NOTE: {
      const deletingNote = findNoteById(state.notes, action.noteId);
      const newNotes = replaceNoteById(state.notes, action.noteId, {
        ...deletingNote,
        deleting: true,
      });
      return {
        ...state,
        deletingNid: action.noteId,
        notes: newNotes,
      };
    }
    case CANCEL_DELETE_NOTE: {
      const deletingNote = findNoteById(state.notes, action.noteId);
      console.log("handle cancel delete file, ", deletingNote);
      const newNotes = replaceNoteById(state.notes, action.noteId, {
        ...deletingNote,
        deleting: false,
      });
      console.log("new notes ", newNotes);
      return {
        ...state,
        notes: newNotes,
      };
    }
    case DELETE_NOTE: {
      DeleteNote(action.noteId);
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
      const filterTodoId = action.todoId === "none" ? null : action.todoId;
      return {
        ...state,
        noteTodoFilter: filterTodoId,
      };
    }
    case IMPORT_NOTE_FROM_REMOTE: {
      console.log("contact remote");

      //doImport();
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
      console.log("export notes");
      const remote = getElectron();
      const fileList = remote.dialog.showOpenDialogSync();

      if (fileList) {
        const f = fileList[0];
        console.log("files is ", f);
        const fs = remote.require("fs");
        const content = fs.readFileSync(f, "utf-8");
        if (content) {
          console.log("content is ", content);
          try {
            const obj = JSON.parse(content);
            obj.files.forEach((doc) => UpdateDocument(getFileId(doc), doc));
            obj.notes.forEach((note) => UpdateNote(getNoteId(note), note));
            obj.todos.forEach((todo) => UpdateTodo(getTodoId(todo), todo));
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
      }
      return state;
    }
    case EXPORT_NOTE: {
      console.log("export notes");
      // eslint-disable-next-line global-require
      const { remote } = require("electron");
      const f = remote.dialog.showSaveDialogSync();

      if (f) {
        exportStateToFile(state, f);
      }
      return state;
    }
    case BACKUP_DB: {
      console.log("backup db");
      exportStateToFile(state, "db_backup.json");
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
        DeleteAllDocuments();
        DeleteAllNotes();
        DeleteAllTodos();
        DeleteSettings();
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
      } else {
        return {
          ...state,
          openResetConfirmDialog: false,
        };
      }
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
    default:
      return state;
  }
}