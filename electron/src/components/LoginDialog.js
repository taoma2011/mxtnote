/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export const LoginDialog = ({
  handleLogin,
  handleClose,
  open,
  loginFailed,
}) => {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
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
        <DialogContentText>Login to MXTNote server</DialogContentText>
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

export default LoginDialog;
