/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResizableRect from 'react-resizable-rotatable-draggable';
import NoteEditorControl from '../containers/NoteEditorControl';
import { selectSelectRect } from './selector';
import * as ActionCreators from '../actions/ActionCreators';

export default function SelectRect() {
  /*
    const {
      top,
      left,
      width,
      height,
      angle,
      hideSelection,
      setRectState
    } = this.props;
*/
  const { scaledRect, showSelection } = useSelector(selectSelectRect);
  const { top, left, width, height, angle } = scaledRect;
  const { setRectState } = ActionCreators;

  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const handleResize = (style, isShiftKey, type) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'
    dispatch(
      setRectState({
        top: Math.round(style.top),
        left: Math.round(style.left),
        width: Math.round(style.width),
        height: Math.round(style.height),
        angle,
      })
    );
  };

  const handleRotate = (a) => {
    dispatch(
      setRectState({
        angle: a,
      })
    );
  };

  const handleDrag = (deltaX, deltaY) => {
    dispatch(
      setRectState({
        left: left + deltaX,
        top: top + deltaY,
        width,
        height,
      })
    );
  };

  const noteEditorStyle = {
    zIndex: 1,
    margin: 0,
    top: top + height + 10,
    right: 'auto',
    bottom: 'auto',
    left: left + 10,
    position: 'absolute',
  };
  return (
    <div className="App" hidden={!showSelection}>
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
