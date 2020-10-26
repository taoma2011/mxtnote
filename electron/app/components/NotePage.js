/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

import NotePanel from "../containers/NotePanel";
import LoadNote from "../containers/LoadNote";
import NoteControl from "../containers/NoteControl";
import NoteEditorDialog from "../containers/NoteEditorDialog";
import ResetConfirmDialog from "../containers/ResetConfirmDialog";
import ResolveConflictDialog from "../containers/ResolveConflictDialog";
import BackupDb from "../containers/BackupDb";

import { getNoteId } from "../utils/common";

export default class NotePage extends Component {
  render() {
    const items = [];
    // eslint-disable-next-line react/prop-types
    const { notes, noteLoaded } = this.props;
    console.log("note page: all notes ", notes);
    if (notes) {
      notes.forEach((note) => {
        const domKey = `notepanel-${getNoteId(note)}`;
        items.push(<NotePanel nid={getNoteId(note)} key={domKey} />);
      });
    }
    return (
      <div>
        {!noteLoaded && <LoadNote />}
        <BackupDb />
        <Paper height="100%">
          <NoteControl />
          <div>{items}</div>
          <NoteEditorDialog />
          <ResetConfirmDialog />
          <ResolveConflictDialog />
        </Paper>
      </div>
    );
  }
}
