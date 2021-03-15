/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { getTodoId } from '../utils/common';

// import { callLogin } from '../utils/api';
import { GetSettings, SetUserPass } from '../utils/db';
import { ElectronFileInputButton } from './ElectronFileInputButton';
import { LoginDialog } from './LoginDialog';
// import { syncRemoteThunk } from '../utils/remote';

import {
  SET_NOTE_TODO_FILTER,
  IMPORT_NOTE_FROM_REMOTE,
  IMPORT_NOTE,
  EXPORT_NOTE,
  OPEN_RESET_CONFIRM_DIALOG,
} from '../actions/file';
import {
  selectTodos,
  selectApi,
  selectNoteTodoFilter,
  selectIsWeb,
} from './selector';

export default function NoteControl(props) {
  const [afterLogin, setAfterLogin] = useState('');
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  let noteTodoFilter = useSelector(selectNoteTodoFilter);

  if (!noteTodoFilter) {
    noteTodoFilter = 'none';
  }
  const todos = useSelector(selectTodos);
  const { dataApi } = useSelector(selectApi);
  const isWeb = useSelector(selectIsWeb);
  const dispatch = useDispatch();
  const filterChanged = (e) =>
    dispatch({ type: SET_NOTE_TODO_FILTER, todoId: e.target.value });
  const importNoteFromRemote = () => dispatch(syncRemoteThunk(dataApi));
  const importNote = () => dispatch({ type: IMPORT_NOTE });

  const exportNote = () => dispatch({ type: EXPORT_NOTE });
  const resetDb = () => dispatch({ type: OPEN_RESET_CONFIRM_DIALOG });

  const selections = [];
  selections.push(
    <MenuItem key="item-none" value="none">
      None
    </MenuItem>
  );

  if (todos) {
    todos.forEach((t, index) => {
      const domKey = `selectitem-${index}`;
      selections.push(
        <MenuItem key={domKey} value={getTodoId(t)}>
          {t.description}
        </MenuItem>
      );
    });
  }

  const doLogin = async () => {
    const settings = await GetSettings();
    if (settings && settings.user && settings.password) {
      // TODO
      // await callLogin(settings.user, settings.password);
      return true;
    }
    return false;
  };

  const doImportNoteFromRemote = async () => {
    /* WEB-INT */
    /*
    const ok = await doLogin();
    if (!ok) {
      setAfterLogin('import-note');
      setOpenLoginDialog(true);

      console.log('open login dialog');
    } else {
      console.log('auto login ok');
      importNoteFromRemote(dataApi);
    }
    */
  };

  const loginWithNewUserPass = async (user, pass) => {
    /* WEB-INT */
    /*
    const ok = await callLogin(user, pass);
    if (ok) {
      setLoginFailed(false);
      setOpenLoginDialog(false);

      console.log('saving user pass');
      SetUserPass(user, pass);
      if (afterLogin === 'import-note') {
        importNoteFromRemote(dataApi);
      }
    } else {
      setLoginFailed(true);
    }
    */
  };

  const handleClose = () => {
    setOpenLoginDialog(false);
  };

  const fileSelected = (name, content) => {
    dispatch({ type: IMPORT_NOTE, content });
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormControl>
          <InputLabel id="input-label">Todo</InputLabel>
          <Select
            labelId="input-label"
            id="demo-simple-select"
            value={noteTodoFilter}
            onChange={filterChanged}
          >
            {selections}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={doImportNoteFromRemote}
        >
          Sync With Remote
        </Button>
      </Grid>

      <Grid item>
        <ElectronFileInputButton label="Import" onFileSelected={fileSelected} />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={exportNote}>
          Export
        </Button>
      </Grid>

      <Grid item>
        <Button variant="contained" color="primary" onClick={resetDb}>
          Reset Db
        </Button>
      </Grid>
      <LoginDialog
        open={openLoginDialog}
        loginFailed={loginFailed}
        handleClose={handleClose}
        handleLogin={loginWithNewUserPass}
      />
    </Grid>
  );
}
