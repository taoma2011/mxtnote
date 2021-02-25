import React, { useEffect } from 'react';
import { getDataApi } from '../utils/tsapi';

export default function LoadLibrary(props: any) {
  // eslint-disable-next-line react/prop-types
  const { addFiles } = props;
  const handleDoc = (docs: any) => {
    // console.log('getting db doc', docs);
    addFiles(docs);
  };
  useEffect(() => {
    // console.log('loading db doc');
    getDataApi().GetAllActiveDocuments(handleDoc);
  });

  return <div />;
}
