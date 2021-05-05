// @flow
import React, {useEffect} from 'react';
import { Provider, useDispatch } from 'react-redux';
import App from './App';
import { SET_API_STATE } from '../actions/file';

// eslint-disable-next-line react/prop-types
const Root = ({ store, initialToken }) => {
  // eslint-disable-next-line react/prop-types
  const { file } = store.getState();
  const { apiState, dataApi } = file;

  console.log('root get file: ', file);
  return (
    <Provider store={store}>
      <App initialToken={initialToken} apiState={apiState} dataApi={dataApi} />
    </Provider>
  );
};

export default Root;
