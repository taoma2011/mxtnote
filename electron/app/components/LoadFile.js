import { Component } from 'react';
import pdfjs from 'pdfjs-dist';

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
    }
    return null;
  }
}
