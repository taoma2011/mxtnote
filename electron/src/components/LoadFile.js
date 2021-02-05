import { Component } from 'react';
import * as pdfjs from 'pdfjs-dist';
//import {loadPdfFile } from '../utils/common';


pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

export default class LoadFile extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { pdfFile, documentLoaded } = this.props;

    if (pdfFile) {
      console.log('loading pdf ', pdfFile);
      // eslint-disable-next-line promise/catch-or-return
      pdfjs.getDocument(pdfFile).promise.then(pdfDoc => {
        documentLoaded(pdfDoc);
        return true;
      });
/*
       loadPdfFile(pdfFile, (pdfDoc)=> {
            documentLoaded(pdfDoc);
       });
*/
    }
    return null;
  }
}
