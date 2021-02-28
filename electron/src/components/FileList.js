/* eslint-disable react/prop-types */
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditLibraryDialog from '../containers/EditLibraryDialog';
import DeleteFileDialog from '../containers/DeleteFileDialog';
import { getFileId } from '../utils/common';

export default function FileList(props) {
  // eslint-disable-next-line react/prop-types
  const { files, gotoFile, editFile, deleteFile } = props;

  const handleClickFile = (index) => {
    const file = files[index];
    // eslint-disable-next-line no-underscore-dangle
    gotoFile(file, file._id);
  };

  return (
    <List>
      {files.map((file, index) => {
        const key = `li-${index}`;
        return (
          <ListItem
            key={key}
            dense
            button
            onClick={() => handleClickFile(index)}
          >
            <ListItemText primary={file.description} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => editFile(getFileId(file))}
              >
                <EditIcon />
              </IconButton>
              <EditLibraryDialog context={getFileId(file)} />
              <DeleteFileDialog context={getFileId(file)} />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteFile(getFileId(file))}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
