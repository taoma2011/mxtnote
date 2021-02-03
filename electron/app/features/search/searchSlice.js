import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  searchText: "",
  searchResults: [],
  status: "idle",
  error: null,
};

export const searchTextInDoc = createAsyncThunk(
  "search/searchTextInDoc",
  ({ searchText, doc }, { dispatch }) => {
    console.log("in searchText thunk, text = ", searchText);
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
            dispatch(searchSlice.actions.addSearchResult(j, 1, "test"));
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

/* example text
dir: "ltr"
fontName: "g_d0_f6"
height: 10.9091
str: "[9] Fontaine J-M.:"
transform: Array(6)
0: 10.9091
1: 0
2: 0
3: 10.9091
4: 78.71952000000002
5: 593.1600999999998
length: 6
__proto__: Array(0)
width: 87.11999841812
*/
