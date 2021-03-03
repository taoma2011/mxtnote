import * as pdfjs from 'pdfjs-dist';
import { GetDocById, GetNoteById } from './db';
import { scaleRect } from './common';

const path = require('path');
const fsPromises = require('fs').promises;
const { remote } = require('electron');

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

export const getImageFromPdfPage = async (note, pdfPage) => {
  const scaledRect = scaleRect(note, note.scale / 100);
  console.log('scaled rect is ', scaledRect);

  const viewport = pdfPage.getViewport({
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

  await pdfPage.render(renderContext).promise;

  console.log('extract image with ', scaledRect);
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