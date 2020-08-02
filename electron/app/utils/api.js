const uuid = require("uuid");
//const BASE_URL = "http://note.mxtsoft.com:4000";
const BASE_URL = "http://localhost:4001";
const { ipcRenderer } = require("electron");
var fs = require("fs");

let token = null;
let remoteUserName = null;
let remoteUserId = null;

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
        remoteUserName = res.username;
        remoteUserId = res.id;
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

export const securePost = (url, body) =>
  new Promise((resolve, reject) => {
    const { net } = require("electron");
    const postData = JSON.stringify(body);
    const request = net.request({
      method: "POST",
      url: url,
    });
    request.setHeader("Content-Type", "application/json");
    request.setHeader("Authorization", "Bearer " + token);
    request.on("response", (response) => {
      //console.log("response is ", response);
      if (response.statusCode != 200) {
        console.log(`got error for ${url}: ${response.statusCode}`);
        //console.log("error response ", response);
        //reject(JSON.parse(new TextDecoder("utf-8").decode(chunk)));
      }
      response.on("data", (chunk) => {
        //console.log(`BODY: ${chunk}`);
        if (response.statusCode == 200) {
          resolve(JSON.parse(new TextDecoder("utf-8").decode(chunk)));
        } else {
          //console.log(`Error BODY: ${chunk}`);
          reject(JSON.parse(new TextDecoder("utf-8").decode(chunk)));
        }
      });
    });
    request.write(postData);
    request.end();
  });

export const secureUploadFile = (url, id, description, fileData) =>
  new Promise((resolve, reject) => {
    const { net } = require("electron");

    const request = net.request({
      method: "POST",
      url: url,
    });

    var FormData = require("form-data");

    //var form = new FormData({ maxDataSize: 20971520 });
    var form = new FormData();
    form.append("id", id);
    form.append("uploadFile", fileData, description);

    request.setHeader("Authorization", "Bearer " + token);
    //console.log("form headers: ", form.getHeaders());
    const fh = form.getHeaders();
    Object.keys(fh).forEach((k) => {
      request.setHeader(k, fh[k]);
    });

    request.writable = true;

    request.on("response", (response) => {
      console.log("upload response is ", response);
      if (response.statusCode != 200) {
        reject("error");
      }
      response.on("data", (chunk) => {
        console.log(`upload response BODY: ${chunk}`);
        resolve(JSON.parse(new TextDecoder("utf-8").decode(chunk)));
      });
    });
    form.pipe(request);
    console.log("sent form");
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

function rectToCenter(left, top, right, bottom, pageW, pageH) {
  const x = (left + right) / 2;
  const y = (top + bottom) / 2;

  return {
    x: x / pageW,
    y: y / pageH,
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
    newFile.synced = true;
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

// this convert from local format to remote format
export const exportRemoteDb = async (db) => {
  /*
  const localFiles = await GetAllDocumentsPromise();
  const localNotes = await GetAllNotesPromise();
  const localTodos = await GetAllTodosPromise();
  */
  const localFiles = db.files;
  const localNotes = db.notes;
  const localTodos = db.todos;

  const newRemoteFiles = [];
  const fileMap = {};
  const tagMap = {};
  const newTags = [];

  for (var i = 0; i < localFiles.length; i++) {
    const localFile = localFiles[i];
    if (localFile.synced) {
      continue;
    }
    console.log("calling create remote file ", i);
    const newRemoteFile = await localFileToRemoteFile(localFile);

    fileMap[localFile._id] = newRemoteFile;

    // update the synced flag
    //localFile.synced = true;
    //UpdateDocument(localFile.id, localFile);
  }

  for (var i = 0; i < localTodos.length; i++) {
    const localTodo = localTodos[i];

    const newTag = {
      name: localTodo.description,
    };
    await createRemoteTag(newTag);
    tagMap[localTodo._id] = newTag;
  }

  for (var i = 0; i < localNotes.length; i++) {
    const localNote = localNotes[i];
    const noteFile = fileMap[localNote.fileId];

    const center = rectToCenter(
      localNote.left,
      localNote.top,
      localNote.right,
      localNote.bottom,

      noteFile.width,
      noteFile.height
    );
    const newWH = {
      width: localNote.width / noteFile.width,
      height: localNote.height / noteFile.height,
    };
    const localNoteTags = localNote.todoDependency;
    const noteTags = [];
    if (localNoteTags) {
      for (var k = 0; k < localNoteTags.length; k++) {
        const t = localNoteTags[k];
        const existingTag = tagMap[t];
        if (existingTag) {
          noteTags.push(existingTag.name);
        }
      }
    }
    const newNote = {
      ...localNote,
      pageX: center.x,
      pageY: center.y,

      ...newWH,

      detail: localNote.detail,
      tags: noteTags,
      createdDate: localNote.created ? Date.parse(localNote.created) : null,
    };
    createRemoteNote(newNote);
  }
};

const createRemoteTag = async (tag) => {
  // implement
};

const createRemoteNote = async (note) => {
  try {
    const n = {
      ...note,
      userId: remoteUserId,
    };
    delete n._id;
    const res = await securePost(BASE_URL + "/notes/create", n);
    return res;
  } catch (e) {
    console.log("create note error ", e);
    return null;
  }
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
  ipcMain.handle("export-db-api", async (event, args) => {
    console.log(args);
    const response = await exportRemoteDb(args);
    console.log("export remote db ", response);
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

export const callExportRemoteDb = async (db) => {
  try {
    const result = await ipcRenderer.invoke("export-db-api", db);
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

export async function localFileToRemoteFile(localFile) {
  try {
    let id = null;
    try {
      const res = await securePost(BASE_URL + "/files/create", {
        username: remoteUserName,
        filename: localFile.description,
        fileUuid: localFile._id,
      });
      id = res.id;
    } catch (e) {
      if (e.id != null) {
        // this could be the file already exist in remote
        // for now we still upload the file again
        id = e.id;
      } else {
        throw e;
      }
    }

    // now upload the file
    const fileData = fs.readFileSync(localFile.file);
    const uploadRes = await secureUploadFile(
      BASE_URL + "/files/upload",
      id,
      localFile.description,
      fileData
    );
    console.log("upload file return ", uploadRes);
    return {
      id: id,
      width: uploadRes.width,
      height: uploadRes.height,
    };
  } catch (e) {
    console.log("create remote file error ", e);
    return null;
  }
}
