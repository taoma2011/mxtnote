const uuid = require("uuid");
//const BASE_URL = "http://note.mxtsoft.com:4000";
const BASE_URL = "http://localhost:4001";
const { ipcRenderer } = require("electron");

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

function centerWHToRect(x, y, w, h, pageW, pageH) {
  return {
    left: (x - w / 2) * pageW,
    right: (x + w / 2) * pageW,
    top: (y - h / 2) * pageH,
    bottom: (y + h / 2) * pageH,
  };
}

export const importRemoteDb = async () => {
  const result = await secureGet(BASE_URL + "/db");
  //console.log("remote db: ", result);
  const newFiles = [];
  const fileMap = {};
  const tagMap = {};
  const newTags = [];

  for (var i = 0; i < result.files.length; i++) {
    const newFile = await remoteFileToLocalFile(result.files[i]);
    newFiles.push(newFile);
    fileMap[newFile.id] = newFile;
    //UpdateDocument(newFile.id, newFile);
  }

  for (var i = 0; i < result.tags.length; i++) {
    const oldTag = result.tags[i];
    const newTag = {
      ...oldTag,
      description: oldTag.name,
    };
    //UpdateTodo(newTag.id, newTag);
    newTags.push(newTag);
    tagMap[newTag.description] = newTag;
  }

  const newNotes = [];
  for (var i = 0; i < result.notes.length; i++) {
    const oldNote = result.notes[i];
    const noteFile = fileMap[oldNote.fileId];
    if (!noteFile || !noteFile.width || !noteFile.height) {
      console.log("ignore note without file width");
      continue;
    }
    if (!oldNote.pageX || !oldNote.pageY || !oldNote.width || !oldNote.height) {
      console.log("ignore without pageX,Y");
      continue;
    }
    const newRect = centerWHToRect(
      oldNote.pageX,
      oldNote.pageY,
      oldNote.width,
      oldNote.height,
      noteFile.width,
      noteFile.height
    );
    const newWH = {
      width: oldNote.width * noteFile.width,
      height: oldNote.height * noteFile.height,
    };
    const oldTags = oldNote.tags;
    const noteTags = [];
    if (oldTags) {
      for (var k = 0; k < oldTags.length; k++) {
        const t = oldTags[k];
        const existingTag = tagMap[t];
        if (existingTag) {
          noteTags.push(existingTag.id);
        } else {
          const newTag = {
            description: t,
          };
          const newId = uuid.v4();
          newTag.id = newId;
          noteTags.push(newId);
          newTags.push(newTag);
          tagMap[t] = newTag;
        }
      }
    }
    const newNote = {
      ...oldNote,
      ...newRect,
      ...newWH,
      scale: 100,
      text: oldNote.detail,
      todoDependency: noteTags,
      created: oldNote.createdDate
        ? Number(Date.parse(oldNote.createdDate))
        : null,
      visible: true,
    };
    newNotes.push(newNote);
    //UpdateNote(newNote.id, newNote);
  }
  // mobile version has tags which is not separate record

  return {
    ...result,
    files: newFiles,
    notes: newNotes,
    todos: newTags,
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
  try {
    const result = await ipcRenderer.invoke("import-db-api", {});
    return result;
  } catch (e) {
    console.log("exception ", e);
    return null;
  }
};

export const callLogin = async (username, password) => {
  //const { ipcRenderer } = require("electron");
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

const remoteFileDirectory = () => {
  const app = require("electron").app;
  const retPath = app.getAppPath() + "/remote_files/";
  console.log("remote file path = ", retPath);
  return retPath;
};
export function getLocalFileNameForRemoteFile(remoteFile) {
  return remoteFileDirectory() + remoteFile.id;
}

const ensureRemoteFileDirectory = () => {
  var fs = require("fs");
  var dir = remoteFileDirectory();

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
