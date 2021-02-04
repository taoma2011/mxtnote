/* eslint-disable react/prop-types */
import React from "react";
//import { useSelector, useDispatch } from "react-redux";
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
//import LoadPage from "../containers/LoadPage";

//import { updatePageScroll } from "../actions/file";

import { FixedSizeList as List } from "react-window";

//import Divider from "@material-ui/core/Divider";
import SplitPane, { Pane } from "react-split-pane";
import BackupDb from "../containers/BackupDb";

//const { BrowserWindow } = require("electron").remote;

export const FilePage = (props) => {
  // eslint-disable-next-line react/prop-types
  //const file = useSelector((state) => state.file);
  const {
    status,
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

  /*
  const pageDivStyle = {
    position: "relative",
  };
  */

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

  const [currentPage] = React.useState(pageNum);
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

        <List
          height={displayPageHeight}
          itemCount={numPages}
          itemSize={displayPageHeight}
          width={pageWidth}
          initialScrollOffset={pageNum > 1 ? (pageNum - 1) * pageHeight : 1}
          onScroll={scrollUpdate}
        >
          {Row}
        </List>
      );
    } else {
      return <p>loading file</p>;
    }
  };

  const viewPortHeight = displayPageHeight;

  const styles = {
    background: "#000",
    width: "2px",
    cursor: "col-resize",
    margin: "0 5px",
    height: "100%",
  };

  return (
    <Box display="flex" flexDirection="column">
      <div
        style={{
          background: "white",
          width: "100%",
        }}
      >
        <Box display="flex" flexDirection="row">
          <FileControl />
          <SearchControl doc={doc} />
        </Box>
      </div>
      <div style={{ height: viewPortHeight }}>
        <Paper height="100%" style={{ height: "100%" }}>
          {!noteLoaded && <LoadNote />}
          {!settingsLoaded && <LoadSettings />}
          {docLoading && <LoadFile />}
          <BackupDb />
          <DeleteNoteDialog />
          <SplitPane
            split="vertical"
            minSize={50}
            style={{ position: "relative" }}
            resizerStyle={styles}
          >
            <div>
              <SearchResult />
            </div>

            <div>{pages()}</div>
          </SplitPane>
        </Paper>
      </div>
    </Box>
  );
};
