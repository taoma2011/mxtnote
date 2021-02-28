import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ADD_FILE_FROM_DB } from '../actions/file';

export default function LoadLibrary() {
  // eslint-disable-next-line react/prop-types
  const dispatch = useDispatch();
  const addFiles = (docs: any) =>
    dispatch({
      type: ADD_FILE_FROM_DB,
      files: docs,
    });

  const selector = (state: any) => {
    const { file } = state;
    const p = {
      libraryLoaded: file.libraryLoaded,
      apiState: file.apiState,
      dataApi: file.dataApi,
    };
    return p;
  };
  const { libraryLoaded, apiState, dataApi } = useSelector(
    selector,
    shallowEqual
  );
  const handleDoc = (docs: any) => {
    // console.log('getting db doc', docs);
    addFiles(docs);
  };
  useEffect(() => {
    // console.log('loading db doc');
    if (apiState === 'ok' && !libraryLoaded) {
      dataApi.GetAllActiveDocuments(handleDoc);
    }
  }, [libraryLoaded, apiState]);

  return <div />;
}
