/* eslint-disable react/prop-types */
import React from "react";
// import styles from './File.css';
// import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
    addNote();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const style = {
    width: 100,
  };
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
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        ContentProps={{
          "aria-describedby": "message-id",
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
    </Grid>
  );
}
