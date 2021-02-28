import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry.js');

export const OpenPdfFile = async (f) => {
  const pdfFile = f.fileName;
  const pdfDoc = await pdfjs.getDocument(pdfFile).promise;
  return pdfDoc;
};

export const GetPdfPage = async (pdfDoc, pageNum) => {
  const page = await pdfDoc.getPage(pageNum);
  return page;
};
