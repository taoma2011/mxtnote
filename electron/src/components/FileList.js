/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { selectFiles, selectEditingFile, selectDeletingFile } from './selector';
import EditLibraryDialog from './EditLibraryDialog';
import DeleteFileDialog from './DeleteFileDialog';
import { getFileId } from '../utils/common';
import { GetFileSettings } from '../utils/db';

import {
  OPEN_GIVEN_FILE,
  START_DELETE_FILE,
  CANCEL_DELETE_FILE,
  START_EDIT_LIBRARY,
  END_EDIT_LIBRARY,
} from '../actions/file';

export default function FileList() {
  // eslint-disable-next-line react/prop-types
  const files = useSelector(selectFiles);
  const { editingFileId } = useSelector(selectEditingFile);
  const { deletingFileId } = useSelector(selectDeletingFile);
  const dispatch = useDispatch();
  const gotoFile = async (file, fileId) => {
    const settings = await GetFileSettings(fileId);
    console.log(`file ${fileId} settings is ${settings}`);
    dispatch({
      type: OPEN_GIVEN_FILE,
      file,
      fileId,
      settings,
    });
  };

  const handleClickFile = (index) => {
    const file = files[index];
    // eslint-disable-next-line no-underscore-dangle
    gotoFile(file, file.id);
  };

  return (
    <>
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
                  onClick={() =>
                    dispatch({
                      type: START_EDIT_LIBRARY,
                      fileId: file.id,
                    })
                  }
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() =>
                    dispatch({
                      type: START_DELETE_FILE,
                      fileId: file.id,
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <EditLibraryDialog
        fileId={editingFileId}
        onClose={() =>
          dispatch({
            type: END_EDIT_LIBRARY,
          })
        }
      />
      <DeleteFileDialog
        fileId={deletingFileId}
        onClose={() =>
          dispatch({
            type: CANCEL_DELETE_FILE,
          })
        }
      />
    </>
  );
}
