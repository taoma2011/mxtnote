/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ResizableRect from 'react-resizable-rotatable-draggable';
import NoteEditorControl from '../containers/NoteEditorControl';

export default class SelectRect extends Component {
  render() {
    const {
      top,
      left,
      width,
      height,
      angle,
      hideSelection,
      setRectState
    } = this.props;
    console.log(
      'resize rect render called ',
      left,
      top,
      width,
      height,
      angle,
      hideSelection
    );
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    // eslint-disable-next-line no-unused-vars
    const handleResize = (style, isShiftKey, type) => {
      // type is a string and it shows which resize-handler you clicked
      // e.g. if you clicked top-right handler, then type is 'tr'
      setRectState({
        top: Math.round(style.top),
        left: Math.round(style.left),
        width: Math.round(style.width),
        height: Math.round(style.height),
        angle
      });
    };

    const handleRotate = a => {
      setRectState({
        angle: a
      });
    };

    const handleDrag = (deltaX, deltaY) => {
      setRectState({
        left: this.left + deltaX,
        top: this.top + deltaY,
        width: this.width,
        height: this.height
      });
    };

    const noteEditorStyle = {
      zIndex: 1,
      margin: 0,
      top: this.top + this.height + 10,
      right: 'auto',
      bottom: 'auto',
      left: this.left + 10,
      position: 'absolute'
    };
    return (
      <div className="App" hidden={hideSelection}>
        <ResizableRect
          left={left}
          top={top}
          width={width}
          height={height}
          rotateAngle={angle}
          // aspectRatio={false}
          // minWidth={10}
          // minHeight={10}
          zoomable="n, w, s, e, nw, ne, se, sw"
          rotatable={false}
          // onRotateStart={this.handleRotateStart}
          onRotate={handleRotate}
          // onRotateEnd={this.handleRotateEnd}
          // onResizeStart={this.handleResizeStart}
          onResize={handleResize}
          // onResizeEnd={this.handleUp}
          // onDragStart={this.handleDragStart}
          onDrag={handleDrag}
          // onDragEnd={this.handleDragEnd}
        />
        <div style={noteEditorStyle}>
          <NoteEditorControl />
        </div>
      </div>
    );
  }
}
