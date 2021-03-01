import * as pdfjs from 'pdfjs-dist';

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
