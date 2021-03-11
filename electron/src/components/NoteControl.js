/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { getTodoId } from '../utils/common';

//import { callLogin } from '../utils/api';
import { GetSettings, SetUserPass } from '../utils/db';

import { LoginDialog } from './LoginDialog';

export default class NoteControl extends Component {
  constructor(props) {
    super(props);
    this.dataApi = props.dataApi;
    this.state = {
      afterLogin: '',
      openLoginDialog: false,
      loginFailed: false,
    };
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const {
      noteTodoFilter,
      todos,
      filterChanged,
      importNoteFromRemote,
      importNote,
      exportNote,
      resetDb,
    } = this.props;

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
      const ok = await doLogin();
      if (!ok) {
        this.setState((state) => {
          return {
            ...state,
            afterLogin: 'import-note',
            openLoginDialog: true,
          };
        });

        console.log('open login dialog');
      } else {
        console.log('auto login ok');
        importNoteFromRemote(this.dataApi);
      }
    };

    const loginWithNewUserPass = async (user, pass) => {
      const ok = await callLogin(user, pass);
      if (ok) {
        this.setState((state) => {
          return {
            ...state,
            loginFailed: false,
            openLoginDialog: false,
          };
        });
        console.log('saving user pass');
        SetUserPass(user, pass);
        if (this.state.afterLogin === 'import-note') {
          importNoteFromRemote(this.dataApi);
        }
      } else {
        this.setState((state) => {
          return {
            ...state,
            loginFailed: true,
          };
        });
      }
    };

    const handleClose = () => {
      this.setState((state) => {
        return {
          ...state,
          openLoginDialog: false,
        };
      });
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
          <Button variant="contained" color="primary" onClick={importNote}>
            Import
          </Button>
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
          open={this.state.openLoginDialog}
          loginFailed={this.state.loginFailed}
          handleClose={handleClose}
          handleLogin={loginWithNewUserPass}
        />
      </Grid>
    );
  }
}
