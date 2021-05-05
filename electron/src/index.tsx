import React from 'react';
import { render } from 'react-dom';
//import App from './App';

import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { InitDb } from './utils/db';
// import { ipcRenderer } from "electron";
import { getElectron } from './utils/common';
import { setUseLocalDataApi } from './utils/env';

try {
  const { remote } = getElectron();
  const fs = remote.require('fs');
  const fileData = fs.readFileSync('api-settings.json');
  const apiSettings = JSON.parse(fileData);
  console.log('set local data api: ', apiSettings.local);
  setUseLocalDataApi(Boolean(apiSettings.local));
} catch (e) {
  console.log('error loading api settings file ', e);
}

const store = configureStore();

export const startIpcRender = () => {
  const { ipcRenderer } = getElectron();
  ipcRenderer.on('sync-progress', (event, arg) => {
    console.log(arg);
    store.dispatch({ type: 'SYNC_PROGRESS', progress: arg });
  });
};

startIpcRender();

InitDb();

render(<Root store={store} initialToken="" />, document.getElementById('root'));
