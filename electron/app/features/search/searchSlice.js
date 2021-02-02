import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  searchResults: [],
  status: "idle",
  error: null,
};

const searchTextInDoc = createAsyncThunk(
  "search/searchTextInDoc",
  ({ searchText, doc }, { getState, dispatch, requestId }) => {
    console.log("doc = ", doc);
    var maxPages = doc.numPages;
    var searchPromises = []; // collecting all page promises
    for (var j = 1; j <= maxPages; j++) {
      var page = doc.getPage(j);

      searchPromises.push(
        page.then(function(page) {
          // add page promise
          var textContent = page.getTextContent();
          return textContent.then(function(text) {
            // return content promise
            console.log(text.items);
            dispatch(addSearchResult(j, 1, "test"));
          });
        })
      );
    }
    return Promise.all(searchPromises);
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addSearchResult: {
      reducer(state, action) {
        state.searchResults.push(action.payload);
      },
      prepare(page, line, text) {
        return { payload: { page, line, text } };
      },
    },
  },
  extraReducers: {
    [searchTextInDoc.fulfilled]: (state, action) => {
      state.status = "idle";
    },
  },
});

export const { addSearchResult } = searchSlice.actions;

export default searchSlice.reducer;

export const selectAllSearchResult = (state) => state.search.searchResults;

export const selectSearchText = (state) => state.search.searchText;
