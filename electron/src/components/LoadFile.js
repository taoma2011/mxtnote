import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectApi, selectCurrentFile } from './selector';
import { FILE_LOADED } from '../actions/file';

export default function LoadFile() {
  const { dataApi, apiState } = useSelector(selectApi, shallowEqual);
  const { documentLoaded, currentFile } = useSelector(
    selectCurrentFile,
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (apiState === 'ok' && !documentLoaded && currentFile !== null) {
      dataApi
        .OpenDocument(currentFile)
        .then((doc) => {
          dispatch({
            type: FILE_LOADED,
            doc,
          });
          return true;
        })
        .catch(() => {});
    }
  }, [apiState, documentLoaded, currentFile]);
  return null;
}
