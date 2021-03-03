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

export const selectTodos = (state) => {
  const { dataApi, apiState } = state.file;
  if (apiState === 'ok') {
    return dataApi.GetCachedTodos();
  }
  return [];
};
