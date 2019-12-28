import React, { useEffect } from 'react';
import { GetAllNotes } from '../utils/db';

export default function LoadNote(props) {
  // eslint-disable-next-line react/prop-types
  const { addNotes } = props;
  const handleNote = notes => {
    console.log('getting notes', notes);
    addNotes(notes);
  };
  useEffect(() => {
    console.log('loading note doc');
    GetAllNotes(handleNote);
  });

  return <div />;
}
