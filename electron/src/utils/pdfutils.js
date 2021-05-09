import * as pdfjs from 'pdfjs-dist';
import { GetDocById, GetNoteById } from './db';
import { scaleRect } from './common';

const path = require('path');

// TODO
// const fsPromises = require('fs').promises;
const fsPromises = null;

// TODO
// const { remote } = require('electron');

pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js');

export const OpenPdfFile = async (f) => {
  const pdfFile = f.file;
  const pdfDoc = await pdfjs.getDocument(pdfFile).promise;
  return pdfDoc;
};

export const GetPdfPage = async (pdfDoc, pageNum) => {
  const page = await pdfDoc.getPage(pageNum);
  return page;
};

export const OpenPdfData = async (d) => {
  const pdfDoc = await pdfjs.getDocument({ data: d }).promise;
  return pdfDoc;
};

export const getImageFromPdfPage = async (note, pdfPage, scale) => {
  const finalScale = (note.scale / 100) * scale;
  const scaledRect = scaleRect(note, finalScale);
  // console.log('scaled rect is ', scaledRect);

  const viewport = pdfPage.getViewport({
    // offsetX: scaledRect.left,
    // offsetY: scaledRect.top,

    scale: finalScale,
  });
  // console.log('viewport is ', viewport);
  // eslint-disable-next-line compat/compat
  const canvas = new OffscreenCanvas(viewport.width, viewport.height);

  const ctx = canvas.getContext('2d');
  const renderContext = {
    canvasContext: ctx,
    viewport,
  };

  await pdfPage.render(renderContext).promise;

  // console.log('extract image with ', scaledRect);
  const image = ctx.getImageData(
    scaledRect.left,
    scaledRect.top,
    scaledRect.width,
    scaledRect.height
  );
  return image.data.buffer;
};

export const LoadNoteImage = async (noteId) => {
  const note = await GetNoteById(noteId);
  const fileName = `${noteId}.img`;
  try {
    const imageFile = path.join(remote.app.getPath('userData'), fileName);

    const contents = await fsPromises.readFile(imageFile);
    return contents;
  } catch (e) {
    console.log('image file not available: ', e);
  }

  const doc = await GetDocById(note.fileId);
  const pdfDoc = await OpenPdfFile(doc);
  const pdfPage = await GetPdfPage(pdfDoc, note.page);
  const image = await getImageFromPdfPage(note, pdfPage);
  return image;
};

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
        // console.log('viewport is ', viewport);
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
