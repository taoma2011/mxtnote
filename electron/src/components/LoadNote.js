import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectApi } from './selector';
import { ADD_NOTE_FROM_DB } from '../actions/file';

export default function LoadNote() {
  const { apiState, dataApi } = useSelector(selectApi);
  const dispatch = useDispatch();
  useEffect(() => {
    if (apiState === 'ok') {
      console.log('loading note doc');
      dataApi
        .GetAllActiveNotes()
        .then((notes) => {
          dispatch({
            type: ADD_NOTE_FROM_DB,
            notes,
          });
          return true;
        })
        .catch((e) => {
          console.log('load notes error: ', e);
        });
    }
  }, [apiState]);

  return <div />;
}
