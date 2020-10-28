import React, { Fragment } from "react";
import { render } from "react-dom";
import { AppContainer as ReactHotAppContainer } from "react-hot-loader";
import Root from "./containers/Root";
import { configureStore, history } from "./store/configureStore";
import { InitDb } from "./utils/db";
import "./app.global.css";

import { ipcRenderer } from "electron";

const store = configureStore();

export const startIpcRender = () => {
  ipcRenderer.on("sync-progress", (event, arg) => {
    console.log(arg);
    store.dispatch({ type: "SYNC_PROGRESS", progress: arg });
  });
};

startIpcRender();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

InitDb();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("root")
);
