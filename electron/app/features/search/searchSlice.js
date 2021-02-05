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
    dispatch(searchSlice.actions.setSearchText(searchText));
    var maxPages = doc.numPages;
    var searchPromises = []; // collecting all page promises
    for (var j = 1; j <= maxPages; j++) {
      var page = doc.getPage(j);
      (function(pn) {
        searchPromises.push(
          page.then(function(page) {
            // add page promise
            var textContent = page.getTextContent();
            return textContent.then(function(text) {
              // organize the text by lines
              const lines = [];
              let currentLineY;
              let currentLine;
              let maxHeight;
              let lineNum = 1;
              //console.log(text.items);
              text.items.map((it) => {
                if (it.dir === "ltr") {
                  const thisY = it.transform[5];
                  //console.log("this y = ", thisY);
                  //console.log("currentLineY = ", currentLineY);
                  if (!currentLineY || Math.abs(thisY - currentLineY) > 5) {
                    if (currentLine) {
                      currentLine.endX = it.transform[4] + it.width;
                      currentLine.height = maxHeight;
                      lines.push(currentLine);
                    }
                    currentLineY = thisY;
                    maxHeight = it.height;
                    currentLine = {
                      y: currentLineY,
                      startX: it.transform[4],
                      line: lineNum,
                      text: it.str,
                    };
                    lineNum = lineNum + 1;
                  } else {
                    if (it.height > maxHeight) {
                      maxHeight = it.height;
                    }
                    currentLine.text = currentLine.text + " " + it.str;
                  }
                }
              });
              lines.map((l) => {
                if (
                  l.text
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase())
                ) {
                  dispatch(
                    searchSlice.actions.addSearchResult(pn, l.line, l.text)
                  );
                }
              });
              //console.log(lines);
            });
          })
        );
      })(j);
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
    setSearchText: {
      reducer(state, action) {
        state.searchText = action.payload.searchText;
        state.searchResults = [];
      },
      prepare(searchText) {
        return {
          payload: {
            searchText,
          },
        };
      },
    },
    cancelSearch(state) {
      state.searchText = "";
      state.searchResults = [];
    },
  },
  extraReducers: {
    [searchTextInDoc.fulfilled]: (state, action) => {
      state.status = "idle";
    },
  },
});

export const { addSearchResult, cancelSearch } = searchSlice.actions;

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
