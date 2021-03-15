import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { getElectron } from '../utils/common';

export const ElectronFileInputButton = (props) => {
  // eslint-disable-next-line react/prop-types
  const { label, onFileSelected } = props;
  const electronOpenFile = () => {
    const remote = getElectron();
    const fileList = remote.dialog.showOpenDialogSync();
    if (fileList) {
      const f = fileList[0];
      const fs = remote.require('fs');
      const content = fs.readFileSync(f);
      onFileSelected(f, content);
    }
  };
  return (
    <Button variant="contained" color="primary" onClick={electronOpenFile}>
      {label}
    </Button>
  );
};

export default ElectronFileInputButton;
