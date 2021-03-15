import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

export const WebFileInputButton = (props) => {
  // eslint-disable-next-line react/prop-types
  const { label, onFileSelected } = props;
  const fileInput = React.createRef();
  const classes = useStyles();
  return (
    <div>
      <input
        ref={fileInput}
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={(e) => {
          console.log('input change ', fileInput);
          const file = fileInput.current.files[0];
          onFileSelected(file.name, file);
        }}
      />
      <label htmlFor="contained-button-file">
        <Button
          variant="contained"
          style={{ backgroundColor: '#7e949c', textTransform: 'none' }}
          component="span"
        >
          {label}
        </Button>
      </label>
    </div>
  );
};

export default WebFileInputButton;
