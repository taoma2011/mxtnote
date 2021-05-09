import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { SET_PAGE_NUMBER } from '../actions/file';
import {
  selectAllSearchResult,
  selectSearchText,
} from '../features/search/searchSlice';

export const SearchResult = () => {
  const searchText = useSelector(selectSearchText);
  const results = useSelector(selectAllSearchResult);
  const close = () => {};
  const dispatch = useDispatch();
  const gotoSearchResult = (r) => {
    dispatch({
      type: SET_PAGE_NUMBER,
      page: r.page,
    });
  };
  if (!searchText) {
    return null;
  }
  const decoratedText = (text) => {
    // console.log("prepare decorated text for ", text);
    const lcSearchText = searchText.toLocaleLowerCase();
    const children = [];
    let remainText = text;
    let i = remainText.toLocaleLowerCase().indexOf(lcSearchText);
    while (i !== -1) {
      // console.log('i = ', i);
      const beforeMatch = text.substring(0, i);
      children.push(<span>{beforeMatch}</span>);
      children.push(
        <span style={{ background: 'orange' }}>
          {text.substring(i, i + searchText.length)}
        </span>
      );
      remainText = remainText.substring(i + searchText.length);
      i = remainText.toLocaleLowerCase().indexOf(lcSearchText);
    }
    if (remainText) {
      children.push(<span>{remainText}</span>);
    }
    return children;
  };
  return (
    <>
      <List dense>
        {results.map((r, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={`sr-${index}`} onClick={() => gotoSearchResult(r)}>
            <div style={{ whiteSpace: 'nowrap' }}>
              <span>Page {r.page}:</span> {decoratedText(r.text)}
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SearchResult;
