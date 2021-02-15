/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import PdfPage from '../containers/PdfPage';
import SelectRect from '../containers/SelectRect';
import StaticRect from '../containers/StaticRect';
import { SearchMatchRect } from './SearchMatchRect';
import { scaleRect } from '../utils/common';

export const PageWrapper = (props) => {
  const [page, setPage] = React.useState(null);

  const {
    pdfDoc,
    pageNum,
    notes,
    scale,
    searchResults,
    fileId,
    pageWidth,
    pageHeight,
  } = props;
  React.useEffect(() => {
    console.log(`loading ${pageNum}`);
    pdfDoc
      // eslint-disable-next-line react/prop-types
      .getPage(pageNum)
      .then((p) => {
        // pageLoaded(page);
        console.log(`page ${pageNum} is loaded`);
        setPage(p);
        return true;
      })
      .catch(() => null);
  });
  const items = [];
  if (notes) {
    Object.keys(notes).forEach((key) => {
      const n = notes[key];
      // eslint-disable-next-line react/prop-types
      if (n.page === pageNum && n.fileId === fileId) {
        items.push(<StaticRect nid={key} key={key} />);
      }
    });
  }
  if (searchResults) {
    searchResults.forEach((sr) => {
      if (sr.page === pageNum) {
        sr.boxes.forEach((b0) => {
          const b = scaleRect(b0, scale / 100);
          items.push(
            <SearchMatchRect
              top={b.top}
              left={b.left}
              width={b.width}
              height={b.height}
              scale={scale}
            />
          );
        });
      }
    });
  }

  if (page) {
    console.log(`page ${pageNum} is ready`);
    return (
      <>
        <SelectRect />
        {items}
        <PdfPage pdfPage={page} pageWidth={pageWidth} pageHeight={pageHeight} />
      </>
    );
  }

  return <p>loading page</p>;
};

PageWrapper.propTypes = {
  pageNum: PropTypes.number.isRequired,
};

export default PageWrapper;
