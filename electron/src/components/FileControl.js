/* eslint-disable react/prop-types */
import React from 'react';
// import styles from './File.css';
// import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { useDispatch } from 'react-redux';
import { SetUserPass } from '../utils/db';
import { LoginDialog } from './LoginDialog';

import { SET_API_STATE } from '../actions/file';

export default function FileControl(props) {
  // eslint-disable-next-line react/prop-types
  const {
    pageNum,
    scale,
    prevPage,
    nextPage,
    textChanged,
    scaleChanged,
    addNote,
    apiState,
    dataApi,
  } = props;

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    addNote();
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const style = {
    width: 100,
  };

  const openLoginDialog = apiState !== 'ok';
  const [loginFailed, setLoginFailed] = React.useState(false);

  const handleLogin = async (user, pass) => {
    const ok = await props.dataApi.Login(user, pass);
    if (ok) {
      console.log('saving user pass');
      SetUserPass(user, pass);
      dispatch({
        type: SET_API_STATE,
        apiState: 'ok',
      });
    }
  };

  const handleCloseLoginDialog = () => {};

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button variant="contained" color="primary" onClick={prevPage}>
          Prev
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={nextPage}>
          Next
        </Button>
      </Grid>

      <Grid item>
        <TextField
          id="standard-basic"
          label="Page"
          value={pageNum}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
          style={style}
          variant="outlined"
          onChange={textChanged}
        />
      </Grid>

      <Grid item>
        <Typography id="continuous-slider" gutterBottom>
          Scale
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Slider
          min={50}
          max={300}
          value={scale}
          onChange={scaleChanged}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" onClick={handleClick}>
          AddNote
        </Button>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Click on pdf to add note</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      <LoginDialog
        open={openLoginDialog}
        handleClose={handleCloseLoginDialog}
        handleLogin={handleLogin}
        loginFailed={loginFailed}
      />
    </Grid>
  );
}
