// @flow

export const OPEN_FILE = 'OPEN_FILE';
export const OPEN_GIVEN_FILE = 'OPEN_GIVEN_FILE';
export const NEXT_PAGE = 'NEXT_PAGE';
export const PREV_PAGE = 'PREV_PAGE';
export const FILE_LOADED = 'FILE_LOADED';
export const PAGE_SIZE_READY = 'PAGE_SIZE_READY';
export const PAGE_LOADED = 'PAGE_LOADED';
export const PAGE_SCROLL_NOTIFY = 'PAGE_SCROLL_NOTIFY';
export const SET_RECT_STATE = 'SET_RECT_STATE';
export const START_ADD_NOTE = 'START_ADD_NOTE';
export const ADD_NOTE = 'ADD_NOTE';
export const ADD_NOTE_FROM_DB = 'ADD_NOTE_FROM_DB';
export const EDIT_NOTE = 'EDIT_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const GOTO_NOTE = 'GOTO_NOTE';
export const FINALIZE_NOTE = 'FINALIZE_NOTE';
export const CANCEL_NEW_NOTE = 'CANCEL_NEW_NOTE';
export const EDIT_TEXT_CHANGED = 'EDIT_TEXT_CHANGED';
export const RENDER_COMPLETE = 'RENDER_COMPLETE';

export const SET_TAB = 'SET_TAB';
export const FILE_TAB = 0;
export const NOTE_TAB = 1;
export const LIBRARY_TAB = 2;
export const TODO_TAB = 3;
export const ADD_FILE = 'LIBRARY/ADD_FILE';
export const ADD_FILE_FROM_DB = 'LIBRARY/ADD_FILE_FROM_DB';
export const DELETE_FILE = 'LIBRARY/DELETE_FILE';
export const GOTO_FILE = 'LIBRARY/GOTO_FILE';

export const ADD_TODO = 'ADD_TODO';
export const ADD_TODO_FROM_DB = 'ADD_TODO_FROM_DB';
export const DELETE_TODO = 'DELETE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const GOTO_TODO = 'GOTO_TODO';
export const TODO_DEPENDENCY_CHANGE = 'TODO_DEPENDENCY_CHANGE';

export const EDIT_TEXT_CHANGED2 = 'EDIT_TEXT-CHANGED2';

export const SCALE_CHANGED = 'SCALE_CHANGED';

export const START_EDIT_LIBRARY = 'START_EDIT_LIBRARY';
export const END_EDIT_LIBRARY = 'END_EDIT_LIBRARY';
export const DOCUMENT_DESCRIPTION_CHANGED = 'DOCUMENT_DESCRIPTION_CHANGED';

export const START_EDIT_TODO = 'START_EDIT_TODO';
export const END_EDIT_TODO = 'END_EDIT_TODO';
export const TODO_DESCRIPTION_CHANGED = 'TODO_DESCRIPTION_CHANGED';

export const START_DELETE_TODO = 'START_DELETE_TODO';
export const CANCEL_DELETE_TODO = 'CANCEL_DELETE_TODO';
export const TOGGLE_TODO_DONE = 'TOGGLE_TODO_DONE';

export const START_DELETE_FILE = 'START_DELETE_FILE';
export const CANCEL_DELETE_FILE = 'CANCEL_DELETE_FILE';

export const START_DELETE_NOTE = 'START_DELETE_NOTE';
export const CANCEL_DELETE_NOTE = 'CANCEL_DELETE_NOTE';

export const SET_NOTE_TODO_FILTER = 'SET_NOTE_TODO_FITLER';

export const SET_PAGE_NUMBER = 'SET_PAGE_NUMBER';

export const IMPORT_NOTE_FROM_REMOTE = 'IMPORT_NOTE_FROM_REMOTE';
export const IMPORT_NOTE = 'IMPORT_NOTE';
export const EXPORT_NOTE = 'EXPORT_NOTE';
export const BACKUP_DB = 'BACKUP_DB';

export const OPEN_RESET_CONFIRM_DIALOG = 'OPEN_RESET_CONFIRM_DIALOG';
export const CLOSE_RESET_CONFIRM_DIALOG = 'CLOSE_RESET_CONFIRM_DIALOG';

export const IMAGE_DATA_READY = 'IMAGE_DATA_READY';
export const IMAGE_FILE_READY = 'IMAGE_FILE_READY';

export const OPEN_NOTE_EDITOR = 'OPEN_NOTE_EDITOR';
export const CLOSE_NOTE_EDITOR = 'CLOSE_NOTE_EDITOR';

export const RESOLVE_CONFLICT = 'RESOLVE_CONFLICT';
export const RESOLVE_DONE = 'RESOLVE_DONE';

export const SYNC_PROGRESS = 'SYNC_PROGRESS';

export const SYNC_DONE = 'SYNC_DONE';
export const SET_API_STATE = 'SET_API_STATE';

export const UPDATE_UI = 'UPDATE_UI';

export const updatePageScroll = (p) => {
  return {
    type: PAGE_SCROLL_NOTIFY,
    page: p,
  };
};
