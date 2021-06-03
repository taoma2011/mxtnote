/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PdfPage from '../containers/PdfPage';
import SelectRect from './SelectRect';
import StaticRect from './StaticRect';
import { SearchMatchRect } from './SearchMatchRect';
import { scaleRect } from '../utils/common';

import { selectApi } from './selector';

export const PageWrapper = React.memo((props) => {
  const [page, setPage] = React.useState(null);

  const { dataApi, apiState } = useSelector(selectApi);
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
    // console.log(`loading ${pageNum}`);
    dataApi
      .GetDocumentPage(pdfDoc, pageNum)
      .then((p) => {
        // pageLoaded(page);
        // console.log(`page ${pageNum} is loaded`);
        setPage(p);
        return true;
      })
      .catch(() => null);
  }, [dataApi, apiState]);
  const items = [];

  // console.log('page wrapper get notes: ', fileId);
  if (notes) {
    notes.forEach((n) => {
      // eslint-disable-next-line react/prop-types
      if (n.page === pageNum && n.fileId === fileId) {
        // console.log('found note in the page ', pageNum);
        items.push(<StaticRect noteId={n.id} key={n.id} />);
      }
    });
  }
  if (searchResults && pageHeight) {
    searchResults.forEach((sr) => {
      if (sr.page === pageNum) {
        sr.boxes.forEach((b0) => {
          // the pdf coordinate system, the origin is at the bottom left
          // we convert to screen system first
          const b = scaleRect(
            {
              left: b0.x,
              top: -b0.y - b0.height,
              width: b0.width,
              height: b0.height,
            },
            scale / 100
          );

          b.top += pageHeight;

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
    //console.log(`page ${pageNum} is ready`);
    return (
      <>
        <SelectRect />
        {items}
        <PdfPage
          pdfPage={page}
          pageNum={pageNum}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
        />
      </>
    );
  }

  return <p>loading page</p>;
});

PageWrapper.propTypes = {
  pageNum: PropTypes.number.isRequired,
};

export default PageWrapper;
