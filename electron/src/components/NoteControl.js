/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { getTodoId } from "../utils/common";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { callLogin } from "../utils/api";
import { GetSettings, SetUserPass } from "../utils/db";

const LoginDialog = ({ handleLogin, handleClose, open, loginFailed }) => {
  const [user, setUser] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleChangeUser = (event) => {
    setUser(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Login</DialogTitle>
      <DialogContent>
        <DialogContentText>Login to MxtNote server</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="User"
          fullWidth
          value={user}
          onChange={handleChangeUser}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Password"
          fullWidth
          value={password}
          onChange={handleChangePassword}
        />
        {loginFailed && <p> login failed</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleLogin(user, password)} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default class NoteControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      afterLogin: "",
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
        return await callLogin(settings.user, settings.password);
      }
      return false;
    };

    const doImportNoteFromRemote = async () => {
      const ok = await doLogin();
      if (!ok) {
        this.setState((state) => {
          return {
            ...state,
            afterLogin: "import-note",
            openLoginDialog: true,
          };
        });

        console.log("open login dialog");
      } else {
        console.log("auto login ok");
        importNoteFromRemote();
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
        console.log("saving user pass");
        SetUserPass(user, pass);
        if (this.state.afterLogin == "import-note") {
          importNoteFromRemote();
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
