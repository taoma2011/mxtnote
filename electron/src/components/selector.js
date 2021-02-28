export const selectApi = (state) => {
  return {
    dataApi: state.file.dataApi,
    apiState: state.file.apiState,
  };
};

export const selectCurrentFile = (state) => {
  return {
    currentFile: state.file.currentFile,
    documentLoaded: state.file.documentLoaded,
  };
};
