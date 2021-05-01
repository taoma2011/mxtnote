// import { Datastore } from 'nedb';

import { generateId } from './common';

let docDb;
let noteDb;
let todoDb;
let settingsDb;

// promise version
let docDbP;
let noteDbP;
let todoDbP;
let settingsDbP;

export const InitDb = () => {
  // eslint-disable-next-line global-require
  const Datastore = require('nedb');
  // eslint-disable-next-line global-require
  const DatastorePromises = require('nedb-promises');
  docDb = new Datastore({ filename: 'doc.db', autoload: true });
  docDbP = DatastorePromises.create('doc.db');
  noteDb = new Datastore({ filename: 'note.db', autoload: true });
  noteDbP = DatastorePromises.create('note.db');
  todoDb = new Datastore({ filename: 'todo.db', autoload: true });
  settingsDb = new Datastore({ filename: 'settings.db', autoload: true });
  settingsDbP = DatastorePromises.create('settings.db');
};

export const TestInitDb = () => {
  // eslint-disable-next-line global-require
  const Datastore = require('nedb');
  docDb = new Datastore({ filename: 'test-doc.db', autoload: true });
  noteDb = new Datastore({ filename: 'test-note.db', autoload: true });
  todoDb = new Datastore({ filename: 'test-todo.db', autoload: true });
  settingsDb = new Datastore({ filename: 'test-settings.db', autoload: true });
};

export const GetDocById = (id) => {
  return docDbP.find({ _id: id });
};

export const GetNoteById = (id) => {
  return noteDbP.find({ _id: id });
};

export const GetNoteByUuid = (uuid) => {
  return new Promise(function (resolve, reject) {
    noteDb.find({ noteUuid: uuid }, function (err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });
};

export const GetSettings = () => {
  return new Promise(function (resolve, reject) {
    settingsDb.find({ scope: 'global' }, function (err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });
};

export const DeleteSettings = () => {
  settingsDb.remove({}, { multi: true });
};

export const SetScale = (s) => {
  console.log('begin set scale ', s);
  settingsDb.update(
    { scope: 'global' },
    { scope: 'global', scale: s },
    { upsert: true },
    (err) => {
      console.log('set scale error ', err);
    }
  );
};

export const GetFileSettings = async (fileId) => {
  settingsDbP.find({ scope: fileId });
};

export const SetFileScale = (fileId, s) => {
  console.log('begin set scale ', s);
  settingsDb.update(
    { scope: fileId },
    { $set: { lastScale: s } },
    { upsert: true },
    (err) => {
      console.log('set scale error ', err);
    }
  );
};

export const SetFileLastPage = (fileId, p) => {
  settingsDb.update(
    { scope: fileId },
    { $set: { lastPage: p } },
    { upsert: true },
    (err) => {
      console.log('set scale error ', err);
    }
  );
};

export const SetUserPass = (user, password) => {
  settingsDb.update(
    { scope: 'global' },
    { scope: 'global', user: user, password: password },
    { upsert: true },
    (err) => {
      console.log('set user pass error ', err);
    }
  );
};

export const DeleteAllDocuments = () => {
  docDb.remove({}, { multi: true });
};

export const AddDocument = async (doc) => {
  let newDoc;
  // local version don't need to save content
  delete doc.content;
  try {
    newDoc = docDbP.insert(doc);
  } catch (e) {
    console.log('insert error: ', e);
    return '';
  }
  // eslint-disable-next-line no-underscore-dangle
  return newDoc._id;
};

export const LocalAddDocument = (cache) => async (doc) => {
  let newDoc;
  // local version don't need to save content
  delete doc.content;
  try {
    newDoc = await docDbP.insert(doc);

    // set the public id field to be the same as _id
    // eslint-disable-next-line no-underscore-dangle
    newDoc.id = newDoc._id;

    await docDbP.update({ _id: newDoc.id }, newDoc);
  } catch (e) {
    console.log('insert error: ', e);
    return '';
  }
  cache.FillFileCache();
  // eslint-disable-next-line no-underscore-dangle
  return newDoc._id;
};

export const UpdateDocument = (id, doc) => {
  if (id) {
    doc.id = id;
  }
  docDb.update({ _id: id }, doc, { upsert: true });
};

export const LocalUpdateDocument = (cache) => async (id, doc) => {
  if (id) {
    doc.id = id;
  }
  try {
    docDbP.update({ _id: id }, doc, { upsert: true });
  } catch (e) {
    console.log('update document error: ', e);
    return false;
  }
  cache.FillFileCache();
  return true;
};

export const LocalDeleteDocument = (cache) => async (fileId) => {
  try {
    await docDbP.remove({ id: fileId }, { multi: true });
  } catch (e) {
    console.log('delete file exception: ', e);
    return;
  }
  console.log('delete locally, refresh cache');
  await cache.FillFileCache();
};

export const DeleteDocument = (fileId) => {
  docDb.remove({ _id: fileId }, { multi: true });
};

export const GetAllDocuments = (handleDoc) => {
  docDb.find({}, (err, doc) => {
    if (!err) {
      handleDoc(doc);
    }
  });
};

export const GetAllActiveDocuments = () =>
  docDbP.find({ deleted: { $ne: true } });

export const GetAllDocumentsPromise = () =>
  new Promise((resolve, reject) => {
    docDb.find({}, (err, doc) => {
      if (!err) {
        resolve(doc);
      } else {
        reject(err);
      }
    });
  });

export const GetDocumentByUuidPromise = (fileUuid) =>
  new Promise((resolve, reject) => {
    docDb.findOne({ fileUuid: fileUuid }, (err, doc) => {
      if (!err) {
        resolve(doc);
      } else {
        reject(err);
      }
    });
  });

export const DeleteAllNotes = () => {
  noteDb.remove({}, { multi: true });
};

export const UpdateNotePromise = async (id, note) => {
  console.log('update note ', note);
  await noteDbP.update({ id }, note, { upsert: true });
};

/*
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-underscore-dangle
    const dbNote = {
      ...note,
      image: null,
    };
    noteDb.update({ id: id }, dbNote, { upsert: true }, function (err, doc) {
      if (!err) {
        resolve(true);
      } else {
        reject(err);
      }
    });
  });
*/
export const LocalCreateNote = (cache) => async (note) => {
  const newId = generateId();
  try {
    note.id = newId;
    await noteDbP.update({ _id: newId }, note, { upsert: true });
    console.log('added ', note);
    await cache.FillNoteCache();
    return newId;
  } catch (e) {
    console.log('exception when create note: ', e);
  }
  return null;
};

export const LocalUpdateNote = (cache) => async (id, note) => {
  try {
    await UpdateNotePromise(id, note);
  } catch (e) {
    console.log('update note exception ', e);
    return false;
  }
  await cache.FillNoteCache();
  return true;
};

export const UpdateNote = (id, note, cb) => {
  // eslint-disable-next-line no-underscore-dangle
  const dbNote = {
    ...note,
    image: null,
  };
  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    noteDb.update({ id: id }, dbNote, { upsert: true });
  } else {
    noteDb.insert(dbNote, function (err, doc) {
      if (cb) {
        cb({
          ...doc,
          image: note.image,
        });
      }
    });
  }
};

export const DeleteNote = (noteId) => {
  //noteDb.remove({ _id: noteId }, { multi: true });
  noteDb.update({ id: noteId }, { deleted: true });
};

export const LocalDeleteNote = (cache) => async (noteId) => {
  // should set deleted instead of delete?
  try {
    console.log('local delete ', noteId);
    await noteDbP.remove({ id: noteId });
  } catch (e) {
    console.log('delete note exception: ', e);
    return false;
  }
  console.log('delete locally, refresh cache');
  await cache.FillNoteCache();
  return true;
};

export const GetAllActiveNotes = (handleNote) => {
  noteDb.find({ deleted: { $ne: true } }, (err, note) => {
    if (!err) {
      handleNote(note);
    }
  });
};

export const GetAllNotesPromise = async () => {
  return noteDbP.find({});
};
/*
  new Promise((resolve, reject) => {
    noteDb.find({}, (err, note) => {
      if (!err) {
        console.log(`get ${note.length} notes`);
        resolve(note);
      } else {
        reject(err);
      }
    });
  });
*/
export const DeleteAllTodos = () => {
  todoDb.remove({}, { multi: true });
};

export const UpdateTodo = (id, todo) => {
  // eslint-disable-next-line no-underscore-dangle
  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    todoDb.update({ _id: id }, todo, { upsert: true });
  } else {
    todoDb.insert(todo);
  }
};

export const NewTodo = (todo) =>
  new Promise((resolve, reject) => {
    todoDb.insert(todo, function (err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc._id);
      }
    });
  });

export const DeleteTodo = (todoId) => {
  todoDb.remove({ _id: todoId }, { multi: true });
};

export const GetAllTodos = (handleTodo) => {
  todoDb.find({}, (err, todo) => {
    if (!err) {
      handleTodo(todo);
    }
  });
};

export const GetAllTodosPromise = () =>
  new Promise((resolve, reject) => {
    todoDb.find({}, (err, todo) => {
      if (!err) {
        resolve(todo);
      } else {
        reject(err);
      }
    });
  });
