/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { FixedSizeList as List } from 'react-window';
import SplitPane from 'react-split-pane';
import FileControl from '../containers/FileControl';
import { SearchControl } from './SearchControl';
import { SearchResult } from './SearchResult';
import DeleteNoteDialog from '../containers/DeleteNoteDialog';
import { PageWrapper } from './PageWrapper';
import LoadNote from '../containers/LoadNote';
import LoadFile from '../containers/LoadFile';
import LoadSettings from '../containers/LoadSettings';
import BackupDb from '../containers/BackupDb';
import { selectSearchText } from '../features/search/searchSlice';

export const FilePage = (props) => {
  // eslint-disable-next-line react/prop-types
  // const file = useSelector((state) => state.file);
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

  /*
  const pageDivStyle = {
    position: "relative",
  };
  */

  const Row = ({ index, style }) => {
    console.log(`loading row ${index}`);
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

  const displayPageHeight = React.useMemo(() => pageHeight || 80, [pageHeight]);
  console.log('display page height = ', displayPageHeight);

  const scrollUpdate = ({ scrollOffset }) => {
    if (pageHeight) {
      const newPageNum = Math.floor((scrollOffset + 1) / pageHeight) + 1;
      if (newPageNum !== pageNum) {
        console.log('update page scroll: ', newPageNum);
        updatePageScroll(newPageNum);
      }
    }
  };

  // the react-window List use PureComponent, it doesn't re-render
  // if only initialScrollOffset is changed
  // so we need to call the scrollToItem api
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef && listRef.current && pageHeight) {
      console.log('scroll in useEffect');
      listRef.current.scrollToItem(pageNum - 1);
    }
  });
  const pages = () => {
    if (status === 'ready') {
      console.log('doc is ready, displayPageHeight is ', displayPageHeight);
      console.log('num page is ', numPages);

      let initialScrollOffset = 0;
      // if we have page height, we scroll to the desired page
      if (pageHeight) {
        initialScrollOffset = (pageNum - 1) * pageHeight + 1;
        console.log('set initial scroll to ', initialScrollOffset);

        const list = (
          <List
            ref={listRef}
            height={pageHeight}
            itemCount={numPages}
            itemSize={pageHeight}
            width={pageWidth}
            initialScrollOffset={initialScrollOffset}
            onScroll={scrollUpdate}
          >
            {Row}
          </List>
        );
        return list;
      }
      console.log('render only the first page');
      return (
        <PageWrapper
          pageNum={1}
          notes={notes}
          pdfDoc={doc}
          key="test-page"
          fileId={fileId}
          pageWidth={0}
          pageHeight={0}
        />
      );
    }
    return <p>loading file</p>;
  };

  const viewPortHeight = displayPageHeight;

  const styles = {
    background: 'blue',
    width: '5px',
    cursor: 'col-resize',
    height: '100%',
  };

  const searchText = useSelector(selectSearchText);
  return (
    <Box display="flex" flexDirection="column">
      <div
        style={{
          background: 'white',
          width: '100%',
        }}
      >
        <Box display="flex" flexDirection="row">
          <FileControl />
          <SearchControl doc={doc} />
        </Box>
      </div>
      <div style={{ height: viewPortHeight }}>
        <Paper height="100%" style={{ height: '100%' }}>
          {!noteLoaded && <LoadNote />}
          {!settingsLoaded && <LoadSettings />}
          {docLoading && <LoadFile />}
          <BackupDb />
          <DeleteNoteDialog />
          {searchText ? (
            <SplitPane
              split="vertical"
              minSize={200}
              style={{ position: 'relative' }}
              resizerStyle={styles}
            >
              <div>
                <SearchResult />
              </div>

              <div>{pages()}</div>
            </SplitPane>
          ) : (
            <div>{pages()}</div>
          )}
        </Paper>
      </div>
    </Box>
  );
};

export default FilePage;