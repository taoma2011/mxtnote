/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import NotePanel from "../containers/NotePanel";
import LoadNote from "../containers/LoadNote";
import NoteControl from "../containers/NoteControl";
import NoteEditorDialog from "../containers/NoteEditorDialog";
import ResetConfirmDialog from "../containers/ResetConfirmDialog";
import ResolveConflictDialog from "../containers/ResolveConflictDialog";
import BackupDb from "../containers/BackupDb";

import { getNoteId } from "../utils/common";

import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const checkEqual = (prevProp, nextProp) => {
  if (prevProp.noteLoaded != nextProp.noteLoaded) return false;
  if (prevProp.notes.length != nextProp.notes.length) return false;
  for (let i = 0; i < prevProp.notes.length; i++) {
    const pn = prevProp.notes[i];
    const nn = nextProp.notes[i];
    if (pn._id != nn._id) return false;
    if (pn.height != nn.height) return false;
    if (pn.scale != nn.scale) return false;
  }
  return true;
};
export const NotePage = React.memo(function NotePage(props) {
  const items = [];
  // eslint-disable-next-line react/prop-types
  const { notes, noteLoaded } = props;
  console.log("note page: all notes ", notes);
  /*
    if (notes) {
      notes.forEach((note) => {
        const domKey = `notepanel-${getNoteId(note)}`;
        items.push(<NotePanel nid={getNoteId(note)} key={domKey} />);
      });
    }
    */
  const noteHeight = (index) => {
    const note = notes[index];
    const scaledHeight = (note.height || 0) * (note.scale / 100);
    return scaledHeight + 120;
  };
  const Row = ({ index, style }) => {
    const note = notes[index];
    const domKey = `notepanel-${getNoteId(note)}`;
    console.log("XXX create note panel ", index);
    return (
      <div style={style}>
        <NotePanel nid={getNoteId(note)} key={domKey} />
      </div>
    );
  };
  /*
    return (
      <div style={{ background: "blue", height: "100%" }}>
        {!noteLoaded && <LoadNote />}
        <BackupDb />
        <Paper height="100%" style={{ height: "100%" }}>
          <div style={{ display: "flex", height: "100%" }}>
            <NoteControl />

            <div style={{ flex: "1 1 auto" }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    itemCount={notes.length}
                    itemSize={35}
                    width={width}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </div>
          </div>
          <NoteEditorDialog />
          <ResetConfirmDialog />
          <ResolveConflictDialog />
        </Paper>
      </div>
    );
    */
  return (
    <div style={{ height: "100%" }}>
      {!noteLoaded && <LoadNote />}
      <BackupDb />
      <NoteControl />
      <Paper height="100%" style={{ height: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={notes.length}
              itemSize={noteHeight}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
        <NoteEditorDialog />
        <ResetConfirmDialog />
        <ResolveConflictDialog />
      </Paper>
      )}
    </div>
  );
}, checkEqual);
