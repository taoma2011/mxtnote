/* eslint-disable react/prop-types */
import React, { Component } from "react";

export default class PdfPage extends Component {
  constructor(props) {
    super(props);
    this.painting = false;
    this.canvas = React.createRef();
    this.notifyRenderComplete = props.notifyRenderComplete;
    this.addNoteAt = props.addNoteAt;
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.repaint();
  }

  componentDidUpdate() {
    this.repaint();
  }

  async repaint() {
    // $FlowFixMe
    const canvas = this.canvas.current;
    const page = this.pdfPage;
    console.log("render page");
    if (!page) {
      return;
    }
    if (this.renderTask) {
      await this.renderTask.promise;
    }
    console.log("render this page ", page);
    console.log("canvas is ", canvas);
    // var viewport = page.getViewport({scale: scale});
    // $FlowFixMe

    //const moreScale = 2.0;
    const moreScale = 2.0;

    const viewport = page.getViewport({ scale: this.scale * moreScale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    canvas.style.height = Math.floor(viewport.height / moreScale) + "px";
    canvas.style.width = Math.floor(viewport.width / moreScale) + "px";

    //canvas.style.height = Math.floor(viewport.height / moreScale);
    //canvas.style.width = Math.floor(viewport.width / moreScale);

    const ctx = canvas.getContext("2d");
    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    // $FlowFixMe
    this.renderTask = page.render(renderContext);

    // Wait for rendering to finish
    // $FlowFixMe
    // eslint-disable-next-line promise/catch-or-return
    this.renderTask.promise
      .then(() => {
        console.log("render done");
        this.notifyRenderComplete(this.canvas.current);
        this.renderTask = null;
        return true;
      })
      .catch((err) => {
        console.log("error in render ", err);
      });
  }

  handleClick(e) {
    // console.log('e = ', e.offsetX, e.offsetY);
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.addingNote) {
      this.addNoteAt(e);
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { pdfPage, scale, addingNote } = this.props;
    this.pdfPage = pdfPage;
    this.scale = scale / 100;
    console.log("pdf page rendered called");
    // eslint-disable-next-line react/prop-types

    const style = addingNote ? { cursor: "crosshair" } : {};
    return (
      <canvas ref={this.canvas} style={style} onClick={this.handleClick} />
    );
  }
}
