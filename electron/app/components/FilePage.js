/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

import FileControl from "../containers/FileControl";
import DeleteNoteDialog from "../containers/DeleteNoteDialog";
import PdfPage from "../containers/PdfPage";
import LoadNote from "../containers/LoadNote";
import LoadFile from "../containers/LoadFile";
import LoadSettings from "../containers/LoadSettings";
import LoadPage from "../containers/LoadPage";
import SelectRect from "../containers/SelectRect";
import StaticRect from "../containers/StaticRect";
import BackupDb from "../containers/BackupDb";

export default class File extends Component {
  render() {
    const items = [];
    // eslint-disable-next-line react/prop-types
    const {
      pageNum,
      fileId,
      docLoading,
      noteLoaded,
      notes,
      settingsLoaded,
    } = this.props;
    //console.log("all notes ", notes);
    if (notes) {
      Object.keys(notes).forEach((key) => {
        const n = notes[key];
        // eslint-disable-next-line react/prop-types
        if (n.page === pageNum && n.fileId === fileId) {
          items.push(<StaticRect nid={key} key={key} />);
        }
      });
    }
    const pageDivStyle = {
      position: "relative",
    };
    return (
      <div>
        <div
          style={{
            background: "white",
            position: "fixed",
            zIndex: 1,
            width: "100%",
            maxHeight: 30,
          }}
        >
          <FileControl />
        </div>
        <div style={{ top: 30, height: "100%" }}>
          <Paper height="100%">
            {!noteLoaded && <LoadNote />}
            {!settingsLoaded && <LoadSettings />}
            {docLoading && <LoadFile />}
            <BackupDb />
            <DeleteNoteDialog />
            <LoadPage />
            <div style={pageDivStyle}>
              <SelectRect />
              {items}
              <PdfPage />
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}
