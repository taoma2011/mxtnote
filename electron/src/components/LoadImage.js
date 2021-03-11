/* eslint-disable global-require */
import React, { useEffect } from 'react';
import { loadImageFromPdf } from '../utils/common';

export default function LoadImage(props) {
  // eslint-disable-next-line react/prop-types
  const {
    noteId,
    note,
    pdfFile,
    imageFile,
    image,
    imageDataReady,
    imageFileReady,
  } = props;

  useEffect(() => {
    /* TODO
    const { remote } = require("electron");
    const fs = remote.require("fs");

    //console.log("existing image file is ", imageFile);
    if (!imageFile && !image && pdfFile) {
      // load image from pdf
      console.log("load image from pdf: ", noteId);
      loadImageFromPdf(pdfFile, note, function(data) {
        imageDataReady(noteId, data);
      });
    } else if (imageFile && !image) {
      console.log("load image from file: ", noteId);
      fs.readFile(imageFile, function(err, contents) {
        if (!err) {
          imageDataReady(noteId, contents);
        }
      });
    } else if (image && !imageFile) {
      console.log("write image file: ", noteId);
      const fileName = `${noteId}.img`;
      const path = require("path");
      const newImageFile = path.join(remote.app.getPath("userData"), fileName);
      fs.writeFile(newImageFile, new Buffer(image), function(err) {
        if (!err) {
          imageFileReady(noteId, newImageFile);
        }
      });
    }
    */
  }, [image, imageFile]);

  return null;
}
