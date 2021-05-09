import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataApiFromThunk } from '../../utils/common';

const initialState = {
  searchText: '',
  searchResults: [],
  status: 'idle',
  error: null,
};

/**
 * compute the bounding box based on the index, and the boxes from the
 * pdf information
 */
function computeBBox(index, length, boxes) {
  // see which box it falls into
  const matchStartIndex = index;
  const matchEndIndex = matchStartIndex + length - 1;
  const matchedBoxes = [];
  boxes.forEach((b) => {
    const boxStartIndex = b.startIndex;
    const boxEndIndex = b.startIndex + b.box.str.length - 1;
    const boxCharCount = b.box.str.length;
    if (boxCharCount === 0) return;
    const intersectionStart = Math.max(matchStartIndex, boxStartIndex);
    const intersectionEnd = Math.min(matchEndIndex, boxEndIndex);
    if (intersectionEnd >= intersectionStart) {
      const boxX = b.box.transform[4];
      const boxY = b.box.transform[5];
      const boxW = b.box.width;
      const boxH = b.box.height;
      const leftAdjust =
        (boxW * (intersectionStart - boxStartIndex)) / boxCharCount;
      const rightAdjust =
        (boxW * (boxEndIndex - intersectionEnd)) / boxCharCount;
      const adjustedW = boxW - leftAdjust - rightAdjust;
      const newBox = {
        x: boxX + leftAdjust,
        y: boxY,
        width: adjustedW,
        height: boxH,
      };
      console.log('add match box ', newBox);
      matchedBoxes.push(newBox);
    }
  });
  return matchedBoxes;
}

function getIndicesOf(searchStr, str) {
  const searchStrLen = searchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  let startIndex = 0;

  let index;
  const indices = [];

  const lowerStr = str.toLowerCase();
  const lowerSearchStr = searchStr.toLowerCase();

  while (true) {
    index = lowerStr.indexOf(lowerSearchStr, startIndex);
    if (index === -1) {
      break;
    }
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

async function searchPage(dataApi, doc, pn, searchText, dispatch) {
  // const pageHandle = await doc.getPage(pn);
  const pageHandle = await dataApi.GetDocumentPage(doc, pn);
  // add page promise
  const text = await pageHandle.getTextContent();

  // organize the text by lines
  const lines = [];
  let currentLineY;
  let currentLine;
  let currentCharIndex;
  let maxHeight;
  let lineNum = 1;
  // console.log(text.items);
  console.log(`search page ${pn} for ${searchText}`);
  text.items.forEach((it) => {
    if (it.dir === 'ltr') {
      const thisY = it.transform[5];
      // console.log("this y = ", thisY);
      // console.log("currentLineY = ", currentLineY);
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
          boxes: [{ startIndex: 0, box: it }],
        };
        lineNum += 1;
        currentCharIndex = it.str.length;
      } else {
        if (it.height > maxHeight) {
          maxHeight = it.height;
        }
        currentLine.text = `${currentLine.text} ${it.str}`;
        currentLine.boxes.push({ startIndex: currentCharIndex + 1, box: it });
        currentCharIndex += it.str.length + 1;
      }
    }
  });
  lines.forEach((l) => {
    if (l.text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
      // need to find the bounding boxes for the match
      const indices = getIndicesOf(searchText, l.text);

      let matchedBoxes = [];
      indices.forEach((i) => {
        const bbox = computeBBox(i, searchText.length, l.boxes);
        matchedBoxes = matchedBoxes.concat(bbox);
      });
      dispatch(
        searchSlice.actions.addSearchResult(pn, l.line, l.text, matchedBoxes)
      );
    }
  });
  // console.log(lines);
}

export const searchTextInDoc = createAsyncThunk(
  'search/searchTextInDoc',
  ({ searchText, doc }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const dataApi = getDataApiFromThunk(thunkAPI);
    console.log('in searchText thunk, text = ', searchText);
    console.log('doc = ', doc);
    dispatch(searchSlice.actions.setSearchText(searchText));
    const maxPages = doc.numPages;
    const searchPromises = []; // collecting all page promises
    for (let j = 1; j <= maxPages; j += 1) {
      (function (pn) {
        searchPromises.push(searchPage(dataApi, doc, pn, searchText, dispatch));
      })(j);
    }
    return Promise.all(searchPromises);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addSearchResult: {
      reducer(state, action) {
        state.searchResults.push(action.payload);
      },
      prepare(page, line, text, boxes) {
        return { payload: { page, line, text, boxes } };
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
      state.searchText = '';
      state.searchResults = [];
    },
  },
  extraReducers: {
    [searchTextInDoc.fulfilled]: (state, action) => {
      state.status = 'idle';
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
