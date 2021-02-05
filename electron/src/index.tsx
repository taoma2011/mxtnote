import React from 'react';
import { render } from 'react-dom';
//import App from './App';

import Root from "./containers/Root";
import { configureStore, history } from "./store/configureStore";
import { InitDb } from "./utils/db";
import { ipcRenderer } from "electron";

const store = configureStore();

export const startIpcRender = () => {
  ipcRenderer.on("sync-progress", (event, arg) => {
    console.log(arg);
    store.dispatch({ type: "SYNC_PROGRESS", progress: arg });
  });
};

startIpcRender();

InitDb();

render(<Root store={store} history={history} />, document.getElementById('root'));
