import { connect } from 'react-redux';
import LoadImage from '../components/LoadImage';
import { IMAGE_DATA_READY, IMAGE_FILE_READY } from '../actions/file';
import { findFileById } from '../utils/common';

function mapStateToProps(state, ownProp) {
  const { file } = state;
  const nid = ownProp.context;
  if (!nid) {
    console.log('load image no nid');
    return {};
  }

  const { files, notes } = file;
  const n = notes[nid];
  //console.log('load image props ', n);
  // find the file with the note
  const { fileId } = n;
  const pdfFile = findFileById(files, fileId);
  return {
    noteId: nid,
    note: n,
    pdfFile: pdfFile ? pdfFile.file : null,
    image: n.image,
    imageFile: n.imageFile,
  };
}

// try to clean up this, dont need to send back event IMAGE_DATA_READY, IMAGE_FILE_READY,
// directly use api to load image and set the image buffer

function mapDispatchToProps(dispatch) {
  return {
    imageDataReady: (noteId, imageBuffer) =>
      dispatch({
        type: IMAGE_DATA_READY,
        buffer: imageBuffer,
        noteId,
      }),
    imageFileReady: (noteId, imageFile) =>
      dispatch({
        type: IMAGE_FILE_READY,
        file: imageFile,
        noteId,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadImage);
