/* eslint-disable react/prop-types */
import { Component } from "react";

export default class LoadPage extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { pdfDoc, pageNum, pageLoaded } = this.props;

    if (pdfDoc) {
      // eslint-disable-next-line react/prop-types
      // eslint-disable-next-line promise/catch-or-return
      pdfDoc.getPage(pageNum).then((page) => {
        pageLoaded(page);
        return true;
      });
    }
    return null;
  }
}
