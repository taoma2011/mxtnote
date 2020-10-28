/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function SyncProgressDialog(props) {
  // eslint-disable-next-line react/prop-types
  const { open, progress, done } = props;
  const isDone = progress === "done";
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle id="reset-confirm-dialog">Sync Progress</DialogTitle>
      <DialogContent>
        <DialogContentText>{progress}</DialogContentText>
        <LinearProgress />
      </DialogContent>
      <DialogActions>
        <Button onClick={done} disabled={!isDone}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
