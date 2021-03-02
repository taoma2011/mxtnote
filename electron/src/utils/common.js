/* eslint-disable global-require */
/* eslint-disable promise/catch-or-return */
import * as pdfjs from 'pdfjs-dist';

export function findFileById(files, id) {
  for (let i = 0; i < files.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (files[i]._id === id) {
      return files[i];
    }
  }
  return null;
}

export function getFileId(file) {
  // eslint-disable-next-line no-underscore-dangle
  return file._id;
}

export function replaceFileById(files, id, newFile) {
  return files.map((file) => {
    if (getFileId(file) === id) {
      return newFile;
    }
    return file;
  });
}

export function getTodoId(todo) {
  // eslint-disable-next-line no-underscore-dangle
  return todo._id;
}

export function findTodoById(todos, id) {
  for (let i = 0; i < todos.length; i += 1) {
    // eslint-disable-next-line no-underscore-dangle
    if (todos[i]._id === id) {
      return todos[i];
    }
  }
  return null;
}

export function replaceTodoById(todos, id, newTodo) {
  return todos.map((todo) => {
    if (getTodoId(todo) === id) {
      return newTodo;
    }
    return todo;
  });
}

export function loadPdfFile(pdfFile, cb) {
  pdfjs.getDocument(pdfFile).promise.then((pdfDoc) => {
    if (pdfDoc) {
      cb(pdfDoc);
    }
  });
}

// this is moved to LoadNoteImage, delete later
export function loadImageFromPdf(pdfFile, note, cb) {
  // eslint-disable-next-line promise/catch-or-return
  console.log('load pdf ', pdfFile);
  pdfjs.getDocument(pdfFile).promise.then((pdfDoc) => {
    if (pdfDoc) {
      pdfDoc.getPage(note.page).then((page) => {
        const scaledRect = scaleRect(note, note.scale / 100);
        console.log('scaled rect is ', scaledRect);

        const viewport = page.getViewport({
          // offsetX: scaledRect.left,
          // offsetY: scaledRect.top,

          scale: note.scale / 100,
        });
        console.log('viewport is ', viewport);
        // eslint-disable-next-line compat/compat
        const canvas = new OffscreenCanvas(viewport.width, viewport.height);

        const ctx = canvas.getContext('2d');
        const renderContext = {
          canvasContext: ctx,
          viewport,
        };

        page.render(renderContext).promise.then(() => {
          console.log('offline render complete');
          if (cb) {
            console.log('extract image with ', scaledRect);
            const image = ctx.getImageData(
              scaledRect.left,
              scaledRect.top,
              scaledRect.width,
              scaledRect.height
            );
            cb(image.data.buffer);
          }
          return true;
        });
        return true;
      });
    }
    return true;
  });
}

export const newNoteId = 'new';
export function isNewNote(id) {
  return id === newNoteId;
}

export function getNoteId(note) {
  // eslint-disable-next-line no-underscore-dangle
  if (note._id) {
    // eslint-disable-next-line no-underscore-dangle
    return note._id;
  }
  return note.id;
}

export function findNoteById(notes, id) {
  return notes[id];
}

export function replaceNoteById(notes, id, newNote) {
  return {
    ...notes,
    [id]: newNote,
  };
}

export function scaleRect(rect, decimalScale0) {
  //const decimalScale = decimalScale0 * 2.0;
  const decimalScale = decimalScale0;
  return {
    top: rect.top * decimalScale,
    left: rect.left * decimalScale,
    width: rect.width * decimalScale,
    height: rect.height * decimalScale,
  };
}

export function getElectron() {
  const { remote } = require('electron');
  return remote;
}

export function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
