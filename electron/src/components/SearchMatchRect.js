import React, { Component } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const SearchMatchRect = (props) => {
  // eslint-disable-next-line react/prop-types
  const { top, left, width, height } = props;
  console.log('search match render called ', left, top, width, height);

  const style = {
    zIndex: 0,
    display: 'block',
    position: 'absolute',
    top,
    left,
    width,
    height,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  };
  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  return <div role="button" style={style} />;
};
