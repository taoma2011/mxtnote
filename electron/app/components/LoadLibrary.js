import React, { useEffect } from "react";
import { GetAllDocuments } from "../utils/db";

export default function LoadLibrary(props) {
  // eslint-disable-next-line react/prop-types
  const { addFiles } = props;
  const handleDoc = (docs) => {
    //console.log('getting db doc', docs);
    addFiles(docs);
  };
  useEffect(() => {
    //console.log('loading db doc');
    GetAllDocuments(handleDoc);
  });

  return <div />;
}
