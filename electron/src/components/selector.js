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
