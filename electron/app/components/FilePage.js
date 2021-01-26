/* eslint-disable react/prop-types */
import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

import FileControl from "../containers/FileControl";
import DeleteNoteDialog from "../containers/DeleteNoteDialog";

import { PageWrapper } from "../components/PageWrapper";
import LoadNote from "../containers/LoadNote";
import LoadFile from "../containers/LoadFile";
import LoadSettings from "../containers/LoadSettings";
import LoadPage from "../containers/LoadPage";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import BackupDb from "../containers/BackupDb";

export default class FilePage extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {
      doc,
      pageNum,
      numPages,
      fileId,
      docLoading,
      noteLoaded,
      notes,
      settingsLoaded,
    } = this.props;
    //console.log("all notes ", notes);

    const pageDivStyle = {
      position: "relative",
    };

    const Row = ({ index, style }) => {
      console.log("loading row ${index}");
      const domKey = `page-panel-${index}`;

      return (
        <div style={style}>
          <PageWrapper
            pageNum={index + 1}
            notes={notes}
            pdfDoc={doc}
            key={domKey}
            fileId={fileId}
          />
        </div>
      );
    };

    const pages = () => {
      if (doc) {
        console.log("doc is ready");
        return (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={numPages}
                itemSize={100}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        );
      } else {
        return <p>loading file</p>;
      }
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
        <div style={{ top: 30, height: 800 }}>
          <Paper height="100%" style={{ height: "100%" }}>
            {!noteLoaded && <LoadNote />}
            {!settingsLoaded && <LoadSettings />}
            {docLoading && <LoadFile />}
            <BackupDb />
            <DeleteNoteDialog />
            {pages()}
          </Paper>
        </div>
      </div>
    );
  }
}
