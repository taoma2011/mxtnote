/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

import Paper from '@material-ui/core/Paper';

import LibraryControl from '../containers/LibraryControl';
import LoadNote from './LoadNote';
import LoadSettings from '../containers/LoadSettings';
import FileList from '../containers/FileList';
import BackupDb from '../containers/BackupDb';

export default function LibraryPage(props) {
  const { noteLoaded, settingsLoaded } = props;

  return (
    <Paper height="100%">
      {!settingsLoaded && <LoadSettings />}
      <LibraryControl />
      <FileList />
    </Paper>
  );
}
