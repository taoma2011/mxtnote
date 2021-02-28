// @flow
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';

// eslint-disable-next-line react/prop-types
const Root = ({ store }) => {
  // eslint-disable-next-line react/prop-types
  const { file } = store.getState();
  const { apiState, dataApi } = file;
  console.log('root get file: ', file);
  return (
    <Provider store={store}>
      <App apiState={apiState} dataApi={dataApi} />
    </Provider>
  );
};

export default Root;
