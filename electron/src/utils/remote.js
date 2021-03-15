import {
  login,
  callLogin,
  callImportRemoteDb,
  callExportRemoteDb,
} from './api';

import { mergeVersions, newNode } from '../version/version';

function syncRemoteThunk(dataApi) {
  return function (dispatch) {
    return doSync(dataApi).then((result) => {
      dispatch(result);
      return true;
    });
  };
}

export async function doSync(dataApi) {
  const currentDocs = await dataApi.GetAllDocumentsPromise();
  const remoteDb = await callImportRemoteDb(currentDocs);
  // console.log("remote db: ", remoteDb);

  remoteDb.files.forEach((f) => {
    f._id = f.id;
    dataApi.UpdateDocument(f.id, f);
  });

  remoteDb.deletedFiles.forEach((f) => {
    dataApi.UpdateDocument(f._id, f);
  });

  await mergeAndExport(dataApi, remoteDb, 0, null);
}

//
// this function will be called when we start to merge,
// and every time after conflict is resolved manually
// it return the next action, which is either to complete
// the sync process, or prompt the user to resolve the
// current conflict
//
export async function mergeAndExport(
  dataApi,
  remoteDb,
  currentIndex,
  resolveResult
) {
  const syncTime = new Date();
  console.log('merging notes');

  let currentResolveResult = resolveResult;
  for (let i = currentIndex; i < remoteDb.notes.length; i += 1) {
    const n = remoteDb.notes[i];
    if (n.noteUuid) {
      console.log('checking note uuid ', n.noteUuid);
      const existingNote = await dataApi.GetNoteByUuid(n.noteUuid);
      if (existingNote) {
        console.log('found existing node with uuid ', n.noteUuid);
        console.log('local sync record is ', existingNote.syncRecord);
        const localVersion = {
          lastModified: existingNote.lastModified,
          lastSynced: existingNote.lastSynced,
          tree: existingNote.syncRecord
            ? JSON.parse(existingNote.syncRecord)
            : null,
        };
        console.log('remote sync record is ', n.syncRecord);
        const remoteVersion = {
          lastModified: n.lastModifiedTime,
          lastSynced: n.lastSynced,
          tree: n.syncRecord ? JSON.parse(n.syncRecord) : null,
        };
        console.log('merging ', n.noteUuid);
        const res = mergeVersions(localVersion, remoteVersion);
        console.log('merge result ', res);
        if (res.status === 'conflict') {
          console.log('cannot merge');
          // ask user to resolve conflict
          if (!currentResolveResult)
            return {
              type: RESOLVE_CONFLICT,
              localNote: existingNote,
              remoteNote: n,
              remoteDb,
              currentIndex: i,
            };
          const result = currentResolveResult;
          currentResolveResult = null;
          console.log('result is ', result);
          if (result === 'local') {
            existingNote.lastSynced = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await dataApi.UpdateNotePromise(existingNote._id, existingNote);
            continue;
          } else if (result === 'remote') {
            Object.assign(existingNote, n);
            console.log('after merging with remote: ', existingNote);
            existingNote.lastSynced = syncTime;
            existingNote.lastModified = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await dataApi.UpdateNotePromise(existingNote._id, existingNote);
            continue;
          } else {
            existingNote.conflict = true;
            await dataApi.UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
        } else {
          if (res.status === 'local') {
            // keep local version, create
            existingNote.lastSynced = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await dataApi.UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
          if (res.status === 'remote') {
            Object.assign(existingNote, n);
            console.log('after merging with remote: ', existingNote);
            existingNote.lastSynced = syncTime;
            existingNote.lastModified = syncTime;
            existingNote.syncRecord = JSON.stringify(res.tree);
            await dataApi.UpdateNotePromise(existingNote._id, existingNote);
            continue;
          }
        }
      }
    }
    console.log('create new note ', n.id);
    n._id = n.id;
    n.lastSynced = syncTime;
    // convert to local field name/format
    n.lastModified = n.lastModifiedTime;
    await dataApi.UpdateNotePromise(n.id, n);
  }
  remoteDb.todos.forEach((t) => {
    t._id = t.id;
    dataApi.UpdateTodo(t.id, t);
  });

  /* export to remote db */
  const localFiles = await dataApi.GetAllDocumentsPromise();

  // if there is no sync record, create one
  const localNotes = await dataApi.GetAllNotesPromise();

  localNotes.forEach(async (n) => {
    if (!n.syncRecord) {
      n.lastSynced = syncTime;
      n.syncRecord = JSON.stringify(newNode());
      await dataApi.UpdateNotePromise(n._id, n);
    }
  });

  const db = {
    files: localFiles,
    notes: localNotes,
    todos: await dataApi.GetAllTodosPromise(),
  };
  await callExportRemoteDb(db);

  return {
    type: IMPORT_NOTE_FROM_REMOTE,
  };
}
