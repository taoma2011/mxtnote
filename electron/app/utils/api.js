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
      //console.log("response is ", response);
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
      //console.log("response is ", response);
      if (response.statusCode != 200) {
        reject("error");
      }
      response.on("data", (chunk) => {
        //console.log(`BODY: ${chunk}`);
        resolve(JSON.parse(new TextDecoder("utf-8").decode(chunk)));
      });
    });
    request.end();
  });

export const secureDownloadFile = (url, file) =>
  new Promise((resolve, reject) => {
    const { net } = require("electron");

    const request = net.request({
      url: url,
    });
    request.setHeader("Content-Type", "application/json");
    request.setHeader("Authorization", "Bearer " + token);
    request.on("response", (response) => {
      //console.log("response is ", response);
      if (response.statusCode != 200) {
        reject("error");
      }
      response.pipe(file);
      response.on("end", () => {
        resolve(true);
      });
    });
    request.end();
  });

export const importRemoteDb = async () => {
  const result = await secureGet(BASE_URL + "/db");
  //console.log("remote db: ", result);
  const newFiles = result.files.map(
    async (file) => await remoteFileToLocalFile(file)
  );
  return {
    ...result,
    files: newFiles,
  };
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
    console.log("get remote db ", response);
    return response;
  });
};

export const callImportRemoteDb = async () => {
  const { ipcRenderer } = require("electron");
  try {
    const result = await ipcRenderer.invoke("import-db-api", {});
    return result;
  } catch (e) {
    return null;
  }
};

export const callLogin = async (username, password) => {
  const { ipcRenderer } = require("electron");
  try {
    const result = await ipcRenderer.invoke("login-api", {
      username: username,
      password: password,
    });
    return result;
  } catch (e) {
    return false;
  }
};

const remoteFileDirectory = "remote_files/";
export function getLocalFileNameForRemoteFile(remoteFile) {
  return remoteFileDirectory + remoteFile.id;
}

const ensureRemoteFileDirectory = () => {
  var fs = require("fs");
  var dir = remoteFileDirectory;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

export async function downloadRemoteFile(remoteFile) {
  const http = require("http");
  const fs = require("fs");
  ensureRemoteFileDirectory();
  const localFile = fs.createWriteStream(
    getLocalFileNameForRemoteFile(remoteFile)
  );
  await secureDownloadFile(
    BASE_URL + "/files/download/" + remoteFile.id,
    localFile
  );
  localFile.close();
}

export async function remoteFileToLocalFile(remoteFile) {
  await downloadRemoteFile(remoteFile);
  return {
    ...remoteFile,
    file: getLocalFileNameForRemoteFile(remoteFile),
    description: remoteFile.filename,
  };
}
