import React, { useEffect } from "react";
import { GetAllActiveNotes } from "../utils/db";

export default function LoadNote(props) {
  // eslint-disable-next-line react/prop-types
  const { addNotes } = props;
  const handleNote = (notes) => {
    console.log("getting notes", notes);
    addNotes(notes);
  };
  useEffect(() => {
    console.log("loading note doc");
    GetAllActiveNotes(handleNote);
  });

  return <div />;
}
