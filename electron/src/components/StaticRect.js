/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectApi, selectScale, selectNoteUiState } from './selector';
import { EDIT_NOTE } from '../actions/file';
import { scaleRect } from '../utils/common';
import * as ActionCreators from '../actions/ActionCreators';

export const StaticRect = (props) => {
  const { noteId } = props;
  const { dataApi } = useSelector(selectApi);
  const { visible, disableClick } = useSelector(selectNoteUiState(noteId));
  const note = dataApi.GetNoteById(noteId);
  const scale = useSelector(selectScale);

  const scaledRect = scaleRect(note, scale / 100);
  const { top, left, width, height } = scaledRect;

  const dispatch = useDispatch();
  const editNote = () => {
    dispatch(ActionCreators.EditNote(noteId));
  };

  const style = {
    visibility: visible ? 'visible' : 'hidden',
    zIndex: 0,
    display: 'block',
    position: 'absolute',
    ...scaledRect,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    // background: rgba(0, 0, 0, 0.5)
  };

  if (disableClick) return <div style={style} />;
  return <div role="button" style={style} onClick={editNote} />;
};

export default StaticRect;
