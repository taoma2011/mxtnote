/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import NotePanel from './NotePanel';
import LoadNote from './LoadNote';
import NoteControl from './NoteControl';
import NoteEditorDialog from '../containers/NoteEditorDialog';
import ResetConfirmDialog from '../containers/ResetConfirmDialog';
import ResolveConflictDialog from '../containers/ResolveConflictDialog';
import DeleteNoteDialog from './DeleteNoteDialog';
import SyncProgressDialog from '../containers/SyncProgressDialog';
import BackupDb from '../containers/BackupDb';
import { selectFilteredNotes } from './selector';
import { getNoteId, compareDate } from '../utils/common';

const checkEqual = (prevProp, nextProp) => {
  if (prevProp.notes == null) {
    if (nextProp.notes != null) return false;
    return true;
  }
  if (nextProp.notes == null) {
    return false;
  }
  if (prevProp.notes.length !== nextProp.notes.length) return false;
  for (let i = 0; i < prevProp.notes.length; i += 1) {
    const pn = prevProp.notes[i];
    const nn = nextProp.notes[i];
    if (pn.id !== nn.id) return false;
    if (pn.height !== nn.height) return false;
    if (pn.scale !== nn.scale) return false;
  }
  return true;
};

export const NotePage = () => {
  // eslint-disable-next-line react/prop-types
  const { notes } = useSelector(selectFilteredNotes, checkEqual);

  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const noteHeight = (index) => {
    const note = notes[index];
    // console.log('compute note height ', note);
    if (!note.height || !note.scale) {
      return 0;
    }
    const scaledHeight = (note.height || 0) * (note.scale / 100);
    // console.log(`saled height for ${index} is ${scaledHeight}`);
    return scaledHeight + 120;
  };
  const Row = ({ index, style }) => {
    const note = notes[index];
    const domKey = `notepanel-${getNoteId(note)}`;

    return (
      <div style={style}>
        <NotePanel
          noteId={getNoteId(note)}
          key={domKey}
          onDelete={(noteId) => setDeletingNoteId(noteId)}
        />
      </div>
    );
  };

  return (
    <div style={{ height: '100%' }}>
      <NoteControl />
      <Paper height="100%" style={{ height: '100%' }}>
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
        <DeleteNoteDialog
          noteId={deletingNoteId}
          onClose={() => setDeletingNoteId(null)}
        />
        <NoteEditorDialog />
        <ResetConfirmDialog />
        <SyncProgressDialog />
        <ResolveConflictDialog />
      </Paper>
    </div>
  );
};

export default NotePage;
