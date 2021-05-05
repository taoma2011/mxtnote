/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';

import { isUseLocalDataApi } from '../utils/env';
import { getElectron } from '../utils/common';

export default function SettingsDialog(props) {
  const { open, onClose } = props;

  const [sel, setSel] = useState(isUseLocalDataApi());

  const commitChange = () => {
    const dataApiSettings = {
      local: sel,
    };
    const { remote } = getElectron();
    const fs = remote.require('fs');

    try {
      fs.writeFileSync(
        'api-settings.json',
        JSON.stringify(dataApiSettings, null, 2),
        'utf-8'
      );
    } catch (e) {
      console.log('Failed to save the file: ', e);
    }
    onClose();

    // restart the app
    const { app } = remote;
    app.relaunch();
    app.exit();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">MXTNote Settings</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={sel}
                onChange={(event) => setSel(event.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Offline mode"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {sel !== isUseLocalDataApi() ? (
          <Button onClick={commitChange} color="primary" autoFocus>
            Save and Restart
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
