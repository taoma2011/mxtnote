/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ResetConfirmDialog(props) {
  // eslint-disable-next-line react/prop-types
  const { open, handleCancel, handleConfirm } = props;

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle id="reset-confirm-dialog">Confirm Reset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This will reset all library items, notes, and todos, are you sure?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          No
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
