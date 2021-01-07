import {
  GetNoteByUuid,
  UpdateNotePromise,
  GetDocumentByUuidPromise,
} from "./db";

const { machineIdSync } = require("node-machine-id");
const version = require("../../version/version");
const uuid = require("uuid");
const BASE_URL = "https://note.mxtsoft.com:4001";
//const BASE_URL = "http://localhost:4001";
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
    let responseStr = "";
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
        responseStr = responseStr + new TextDecoder("utf-8").decode(chunk);
      });
      response.on("end", () => {
        //console.log("response end");
        resolve(JSON.parse(responseStr));
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
    let responseStr = "";
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
        responseStr = responseStr + new TextDecoder("utf-8").decode(chunk);
      });
      response.on("end", () => {
        //console.log("response end");
        const parsedResult = JSON.parse(responseStr);
        if (response.statusCode == 200) resolve(parsedResult);
        else reject(parsedResult);
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

    const FormData = require("form-data");

    //var form = new FormData({ maxDataSize: 20971520 });
    const form = new FormData();
    form.append("id", id);
    //form.append("uploadFile", fileData, description);
    form.append("uploadFile", fileData, {
      contentType: "application/pdf",
      filename: description,
    });
    //const blob = new Blob([fileData], { type: "application/pdf" });
    //form.append("uploadFile", blob);

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
  console.log(
    `rect to center ${left}, ${top}, ${right}, ${bottom}, ${pageW}, ${pageH}`
  );
  const x = (left + right) / 2;
  const y = (top + bottom) / 2;

  return {
    x: x / pageW,
    y: y / pageH,
  };
}

const hasLocalDoc = (f, localDocs) => {
  for (let i = 0; i < localDocs.length; i++) {
    const d = localDocs[i];
    if (d.fileUuid && f.fileUuid && d.fileUuid == f.fileUuid) {
      return d;
    }
  }
  return null;
};

const setLocalFileDeleted = (f) => {
  f.deleted = true;
  f.deletedDate = new Date();
};

export const importRemoteDb = async (event, localDocs) => {
  const result = await secureGet(BASE_URL + "/db");
  //console.log("remote db: ", result);
  const newFiles = [];
  const fileMap = {};
  const tagMap = {};
  const newTags = [];
  const deletedFiles = [];

  event.sender.send("sync-progress", "Download remote files");
  for (var i = 0; i < result.files.length; i++) {
    const f = result.files[i];
    const localFile = hasLocalDoc(f, localDocs);
    if (localFile) {
      fileMap[f.id] = localFile;
      if (f.deleted) {
        setLocalFileDeleted(localFile);
        deletedFiles.push(localFile);
      }
    } else {
      event.sender.send(
        "sync-progress",
        `Download file ${result.files[i].filename} ${i + 1}/${
          result.files.length
        }`
      );
      const newFile = await remoteFileToLocalFile(result.files[i]);
      newFiles.push(newFile);
      fileMap[f.id] = newFile;
    }
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
    event.sender.send(
      "sync-progress",
      `Download note ${i + 1}/${result.notes.length}`
    );

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
      // mobile version page number start with 0
      // desktop version start with 1
      page: oldNote.page + 1,
      scale: 100,
      text: oldNote.detail,
      todoDependency: noteTags,
      created: oldNote.createdDate
        ? Number(Date.parse(oldNote.createdDate))
        : null,
      visible: true,
    };

    // if the remote note doesn't have sync record, create one,
    // later it will be pushed back to remote
    if (!newNote.syncRecord) {
      newNote.syncRecord = JSON.stringify(version.newNode());
    }

    newNotes.push(newNote);
    //UpdateNote(newNote.id, newNote);
  }
  // mobile version has tags which is not separate record

  // return the data to be updated, the update will be driven by ui thread
  return {
    ...result,
    files: newFiles,
    notes: newNotes,
    todos: newTags,
    deletedFiles,
  };
};

// this convert from local format to remote format
export const exportRemoteDb = async (event, db) => {
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

  const myId = machineIdSync() + ":mxtnote-electron";
  for (var i = 0; i < localFiles.length; i++) {
    const localFile = localFiles[i];
    event.sender.send(
      "sync-progress",
      `Upload file ${localFile.description} ${i + 1}/${localFiles.length}`
    );

    if (!localFile.originalDevice) {
      localFile.originalDevice = myId;
    }
    if (localFile.originalDevice != myId) {
      // originally non-local file, don't need to send again
      fileMap[localFile._id] = localFile;

      // check if the file has been deleted locally, if so we need to notify remote
      if (localFile.deleted) {
        await notifyLocalFileDelete(loalFile);
      }
      continue;
    }
    console.log("originalDeviceId is ", localFile.originalDevice);
    console.log("myid is ", myId);
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
    event.sender.send(
      "sync-progress",
      `Upload note ${i + 1}/${localNotes.length}`
    );
    if (!localNote.originalDevice) {
      localNote.originalDevice = myId;
    }

    /*
    if (localNote.originalDevice != myId) {
      console.log("skip non-local note");
      continue;
    }
    */

    if (localNote.conflict) {
      console.log("skip conflict note");
      continue;
    }

    const noteFile = fileMap[localNote.fileId];

    //console.log("local note is ", JSON.stringify(localNote));
    const center = rectToCenter(
      localNote.left,
      localNote.top,
      localNote.left + localNote.width,
      localNote.top + localNote.height,

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

      // mobile versin page start with 1
      page: localNote.page - 1,
      ...newWH,
      //fileId: noteFile.id,
      detail: localNote.text,
      tags: noteTags,
      createdDate: localNote.created ? Date.parse(localNote.created) : null,
    };

    createRemoteNote(newNote);
  }
  event.sender.send("sync-progress", `done`);
};

const createRemoteTag = async (tag) => {
  // implement
};

const createRemoteNote = async (note) => {
  try {
    const n = {
      ...note,
      userId: remoteUserId,
      lastModifiedTime: note.lastModified,
    };
    delete n._id;

    const res = await securePost(BASE_URL + "/notes/sync", n);
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
    //console.log(args);
    const response = await importRemoteDb(event, args);
    //console.log("get remote db ", response);
    return response;
  });
  ipcMain.handle("export-db-api", async (event, args) => {
    //console.log(args);
    const response = await exportRemoteDb(event, args);
    //console.log("export remote db ", response);
    return response;
  });
};

export const startIpcRender = () => {
  ipcRenderer.on("sync-progress", (event, arg) => {
    console.log(arg);
  });
};

export const callImportRemoteDb = async (arg) => {
  try {
    //console.log("before calling import remote db");
    const result = await ipcRenderer.invoke("import-db-api", arg);
    //console.log("call import got result: ", result);
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
  const retPath = app.getPath("appData") + "/remote_files/";
  //console.log("remote file path = ", retPath);
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

export async function notifylocalFileDelete(localFile) {
  // is localFile._id aways uuid?
  try {
    // XXX need to implement this api
    const res = await securePost(BASE_URL + "/files/notify", {
      fileUuid: localFile._id,
      action: "delete",
    });
  } catch (e) {
    console.log("notify local file delete error ", e);
    return null;
  }
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
        console.log("remote file already exist ", id);
        return {
          id: id,
          width: e.width,
          height: e.height,
        };
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
