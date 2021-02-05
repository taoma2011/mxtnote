/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

export default class StaticRect extends Component {
  render() {
    const {
      top,
      left,
      width,
      height,
      visible,
      editNote,
      disableClick
    } = this.props;
    console.log(
      'static rect render called ',
      left,
      top,
      width,
      height,
      visible
    );
    this.top = top || 0;
    this.left = left || 0;
    this.width = width || 0;
    this.height = height || 0;

    console.log('bottom is ', this.top + this.height);
    const style = {
      visibility: visible ? 'visible' : 'hidden',
      zIndex: 0,
      display: 'block',
      position: 'absolute',
      top: this.top,
      left: this.left,
      width: this.width,
      height: this.height,
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'red'
      // background: rgba(0, 0, 0, 0.5)
    };

    if (disableClick) return <div style={style} />;
    return <div role="button" style={style} onClick={editNote} />;
  }
}
