import { scaleRect } from '../utils/common';

export const selectApi = (state) => {
  return {
    dataApi: state.file.dataApi,
    apiState: state.file.apiState,
  };
};

export const selectFiles = (state) => {
  const { dataApi, apiState } = state.file;
  if (apiState === 'ok') {
    return dataApi.GetCachedDocuments();
  }
  return [];
};

export const selectCurrentFile = (state) => {
  return {
    currentFile: state.file.currentFile,
    documentLoaded: state.file.documentLoaded,
  };
};

export const selectScale = (state) => {
  return state.file.scale;
};

// get all notes
export const selectNotes = (state) => {
  const { file } = state;
  const { apiState, dataApi } = file || {};
  let noteArray = [];

  if (apiState === 'ok') {
    noteArray = dataApi.GetCachedNotes();
  }
  return noteArray;
};

// used by notes tab
export const selectFilteredNotes = (state) => {
  const { file } = state;
  const { noteTodoFilter, apiState, dataApi } = file || {};
  let noteArray = [];

  if (apiState === 'ok') {
    noteArray = dataApi.GetCachedNotes();
  }

  const noteArrayFiltered = noteTodoFilter
    ? noteArray.filter((n) => {
        return (
          n.todoDependency && n.todoDependency.indexOf(noteTodoFilter) !== -1
        );
      })
    : noteArray;

  const noteArraySorted = noteArrayFiltered.sort(function (n1, n2) {
    const t1 = n1.lastModified ? Date.parse(n1.lastModified) : 0;
    const t2 = n2.lastModified ? Date.parse(n2.lastModified) : 0;
    return t2 - t1;
  });

  const noteSummaryArray = noteArraySorted.map((n) => {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: n.id,
      height: n.height,
      scale: n.scale,
    };
  });
  return { notes: noteSummaryArray };
};

export const selectNoteTodoFilter = (state) => {
  const { file } = state;
  const { noteTodoFilter } = file || {};
  return noteTodoFilter;
};

export const selectTodos = (state) => {
  const { dataApi, apiState } = state.file;
  if (apiState === 'ok') {
    return dataApi.GetCachedTodos();
  }
  return [];
};

export const selectEditingNote = (state) => {
  const { editingNid, apiState, dataApi } = state.file;
  if (apiState !== 'ok') {
    return {
      editingNoteId: editingNid,
      editingNote: null,
    };
  }
  return {
    editingNoteId: editingNid,
    editingNote: dataApi.GetNoteById(editingNid),
  };
};

export const selectDeletingNote = (state) => {
  const { deletingNid } = state.file;
  return { deletingNoteId: deletingNid };
};

export const selectNoteById = (noteId) => (state) => {
  const { dataApi, apiState } = state.file;
  if (apiState !== 'ok') {
    return null;
  }

  return dataApi.GetNoteById(noteId);
};

export const selectNoteUiState = (noteId) => (state) => {
  const { editingNid } = state.file;
  return {
    // if editing this note, only show selection box, not the static box
    visible: editingNid !== noteId,
    disableClick: Boolean(editingNid),
  };
};

export const selectSelectRect = (state) => {
  const { showSelection, rect, scale } = state.file;
  const scaledRect = rect
    ? scaleRect(rect, scale / 100)
    : {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        angle: 0,
      };

  return { showSelection, scaledRect };
};

export const selectIsWeb = (state) => state.file.isWeb;

export const selectFilePageProps = (state) => {
  const { file, search } = state;
  const {
    scale,
    pageNum,
    numPages,
    fileId,
    doc,
    docLoading,
    noteLoaded,
    pageWidth,
    pageHeight,
  } = file || {};
  const { searchResults } = search || {};

  let status = 'loading';
  let message;
  if (!doc) {
    message = 'loading document';
  } else {
    status = 'ready';
  }

  return {
    status,
    message,
    doc,
    docLoading,
    pageNum,
    numPages,
    fileId,
    scale,
    searchResults,
    noteLoaded,
    pageWidth,
    pageHeight,
  };
};
