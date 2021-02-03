/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import FileControl from "../containers/FileControl";
import { SearchControl } from "../components/SearchControl";
import { SearchResult } from "../components/SearchResult";
import DeleteNoteDialog from "../containers/DeleteNoteDialog";

import { PageWrapper } from "../components/PageWrapper";
import LoadNote from "../containers/LoadNote";
import LoadFile from "../containers/LoadFile";
import LoadSettings from "../containers/LoadSettings";
import LoadPage from "../containers/LoadPage";

//import { updatePageScroll } from "../actions/file";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import BackupDb from "../containers/BackupDb";

const { BrowserWindow } = require("electron").remote;

export const FilePage = (props) => {
  // eslint-disable-next-line react/prop-types
  //const file = useSelector((state) => state.file);
  const {
    status,
    message,
    doc,
    pageNum,
    numPages,
    fileId,
    docLoading,
    noteLoaded,
    notes,
    settingsLoaded,
    pageWidth,
    pageHeight,
    updatePageScroll,
  } = props;
  //console.log("all notes ", notes);
  //const dispatch = useDispatch();

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
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      </div>
    );
  };

  //console.log("browser window is ", BrowserWindow);
  const displayPageHeight = React.useMemo(
    () => (pageHeight ? pageHeight : 80),
    [pageHeight]
  );
  console.log("display page height = ", displayPageHeight);

  const [currentPage, setCurrentPage] = React.useState(pageNum);
  const scrollUpdate = ({ scrollOffset }) => {
    if (pageHeight) {
      const newPageNum = Math.floor(scrollOffset / pageHeight) + 1;
      if (newPageNum != currentPage) {
        console.log("update page scroll: ", newPageNum);
        updatePageScroll(newPageNum);
      }
    }
  };
  const pages = () => {
    if (status === "ready") {
      console.log("doc is ready, displayPageHeight is ", displayPageHeight);
      console.log("num page is ", numPages);
      return (
        // somehow the initialScrollOffset doesn't like 0 value
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={numPages}
              itemSize={displayPageHeight}
              width={width}
              initialScrollOffset={pageNum > 1 ? (pageNum - 1) * pageHeight : 1}
              onScroll={scrollUpdate}
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

  const viewPortHeight = displayPageHeight;
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
        <SearchControl doc={doc} />
      </div>
      <div style={{ top: 30, height: viewPortHeight }}>
        <Paper height="100%" style={{ height: "100%" }}>
          {!noteLoaded && <LoadNote />}
          {!settingsLoaded && <LoadSettings />}
          {docLoading && <LoadFile />}
          <BackupDb />
          <DeleteNoteDialog />
          <Box flexDirection="row" alignItems="stretch">
            <SearchResult />
            {pages()}
          </Box>
        </Paper>
      </div>
    </div>
  );
};
