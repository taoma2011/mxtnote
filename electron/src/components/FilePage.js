/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { FixedSizeList as List } from 'react-window';
import SplitPane from 'react-split-pane';
import FileControl from '../containers/FileControl';
import { SearchControl } from './SearchControl';
import { SearchResult } from './SearchResult';
import DeleteNoteDialog from './DeleteNoteDialog';
import { PageWrapper } from './PageWrapper';
import LoadNote from './LoadNote';
import LoadFile from './LoadFile';
import LoadSettings from '../containers/LoadSettings';
import BackupDb from '../containers/BackupDb';
import { selectSearchText } from '../features/search/searchSlice';
import {
  selectNotes,
  selectCurrentFile,
  selectFilePageProps,
} from './selector';
import { updatePageScroll } from '../actions/file';

export const FilePage = (props) => {
  // eslint-disable-next-line react/prop-types
  // const file = useSelector((state) => state.file);
  const {
    status,
    doc,
    pageNum,
    pageNumIsEffective,
    numPages,
    docLoading,
    noteLoaded,
    scale,
    searchResults,
    settingsLoaded,
    pageWidth,
    pageHeight,
  } = useSelector(selectFilePageProps, shallowEqual);

  const dispatch = useDispatch();
  console.log('page height = ', pageHeight);

  const notes = useSelector(selectNotes, shallowEqual);
  const { currentFile } = useSelector(selectCurrentFile, shallowEqual);
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
          scale={scale}
          searchResults={searchResults}
          pdfDoc={doc}
          key={domKey}
          fileId={currentFile.id}
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
        dispatch(updatePageScroll(newPageNum));
      }
    }
  };

  // the react-window List use PureComponent, it doesn't re-render
  // if only initialScrollOffset is changed
  // so we need to call the scrollToItem api
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef && listRef.current && pageHeight && pageNumIsEffective) {
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
          fileId={currentFile.id}
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
          {!settingsLoaded && <LoadSettings />}
          <LoadFile />
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
