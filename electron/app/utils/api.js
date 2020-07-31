//const BASE_URL = "http://note.mxtsoft.com:4000";
const BASE_URL = "http://localhost:4001";

let token = null;

export const login = (args) =>
  new Promise((resolve, reject) => {
    const { net } = require("electron");
    const postData = JSON.stringify(args);
    console.log("post data ", postData);
    const request = net.request({
      method: "POST",
      url: BASE_URL + "/users/authenticate",
    });
    request.setHeader("Content-Type", "application/json");
    request.on("response", (response) => {
      console.log("response is ", response);
      if (response.statusCode != 200) {
        reject("error");
      }
      response.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
        const res = JSON.parse(new TextDecoder("utf-8").decode(chunk));
        token = res.token;
        console.log("set token to ", token);
        resolve(true);
      });
    });
    request.write(postData);

    request.end();
  });

export const secureGet = (url) =>
  new Promise((resolve, reject) => {
    const { net } = require("electron");

    const request = net.request({
      url: url,
    });
    request.setHeader("Content-Type", "application/json");
    request.setHeader("Authorization", "Bearer " + token);
    request.on("response", (response) => {
      console.log("response is ", response);
      if (response.statusCode != 200) {
        reject("error");
      }
      response.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
        resolve(new TextDecoder("utf-8").decode(chunk));
      });
    });
    request.end();
  });

export const importRemoteDb = async () => {
  const result = await secureGet(BASE_URL + "/db");
  console.log("remote db: ", result);
};

export const startIpcMain = () => {
  const { ipcMain } = require("electron");
  ipcMain.handle("login-api", async (event, args) => {
    console.log(args);
    const response = await login(args);
    return response;
  });
  ipcMain.handle("import-db-api", async (event, args) => {
    console.log(args);
    const response = await importRemoteDb(args);
    return response;
  });
};

export const callImportRemoteDb = () => {
  const { ipcRenderer } = require("electron");
  ipcRenderer.invoke("import-db-api", {}).then((result) => {
    console.log("result: ", result);
  });
};

export const callLogin = async (username, password) => {
  const { ipcRenderer } = require("electron");
  try {
    const result = ipcRenderer.invoke("login-api", {
      username: username,
      password: password,
    });
    return result;
  } catch (e) {
    return false;
  }
};
