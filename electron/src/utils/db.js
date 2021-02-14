// import { Datastore } from 'nedb';

let docDb;
let noteDb;
let todoDb;
let settingsDb;

export const InitDb = () => {
  // eslint-disable-next-line global-require
  const Datastore = require("nedb");
  docDb = new Datastore({ filename: "doc.db", autoload: true });
  noteDb = new Datastore({ filename: "note.db", autoload: true });
  todoDb = new Datastore({ filename: "todo.db", autoload: true });
  settingsDb = new Datastore({ filename: "settings.db", autoload: true });
};

export const TestInitDb = () => {
  // eslint-disable-next-line global-require
  const Datastore = require("nedb");
  docDb = new Datastore({ filename: "test-doc.db", autoload: true });
  noteDb = new Datastore({ filename: "test-note.db", autoload: true });
  todoDb = new Datastore({ filename: "test-todo.db", autoload: true });
  settingsDb = new Datastore({ filename: "test-settings.db", autoload: true });
};

export const GetNoteByUuid = (uuid) => {
  return new Promise(function(resolve, reject) {
    noteDb.find({ noteUuid: uuid }, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });
};

export const GetSettings = () => {
  return new Promise(function(resolve, reject) {
    settingsDb.find({ scope: "global" }, function(err, doc) {
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
  console.log("begin set scale ", s);
  settingsDb.update(
    { scope: "global" },
    { scope: "global", scale: s },
    { upsert: true },
    (err) => {
      console.log("set scale error ", err);
    }
  );
};

export const SetUserPass = (user, password) => {
  settingsDb.update(
    { scope: "global" },
    { scope: "global", user: user, password: password },
    { upsert: true },
    (err) => {
      console.log("set user pass error ", err);
    }
  );
};

export const DeleteAllDocuments = () => {
  docDb.remove({}, { multi: true });
};

export const AddDocument = (doc) => {
  docDb.insert(doc);
};

export const UpdateDocument = (id, doc) => {
  docDb.update({ _id: id }, doc, { upsert: true });
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

export const GetAllActiveDocuments = (handleDoc) => {
  docDb.find({ deleted: { $ne: true } }, (err, doc) => {
    if (!err) {
      handleDoc(doc);
    }
  });
};

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

export const UpdateNotePromise = (id, note) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-underscore-dangle
    const dbNote = {
      ...note,
      image: null,
    };
    noteDb.update({ _id: id }, dbNote, { upsert: true }, function(err, doc) {
      if (!err) {
        resolve(doc);
      } else {
        reject(err);
      }
    });
  });

export const UpdateNote = (id, note, cb) => {
  // eslint-disable-next-line no-underscore-dangle
  const dbNote = {
    ...note,
    image: null,
  };
  if (id) {
    // eslint-disable-next-line no-underscore-dangle
    noteDb.update({ _id: id }, dbNote, { upsert: true });
  } else {
    noteDb.insert(dbNote, function(err, doc) {
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
  noteDb.update({ _id: noteId }, { deleted: true });
};

export const GetAllActiveNotes = (handleNote) => {
  noteDb.find({ deleted: { $ne: true } }, (err, note) => {
    if (!err) {
      handleNote(note);
    }
  });
};

export const GetAllNotesPromise = () =>
  new Promise((resolve, reject) => {
    noteDb.find({}, (err, note) => {
      if (!err) {
        resolve(note);
      } else {
        reject(err);
      }
    });
  });

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
    todoDb.insert(todo, function(err, doc) {
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