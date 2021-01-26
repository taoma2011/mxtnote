import React from "react";
import PdfPage from "../containers/PdfPage";
import SelectRect from "../containers/SelectRect";
import StaticRect from "../containers/StaticRect";

export const PageWrapper = (props) => {
  const [page, setPage] = React.useState(null);
  const { pdfDoc, pageNum, notes, fileId } = props;
  React.useEffect(() => {
    console.log(`loading ${pageNum}`);
    pdfDoc.getPage(pageNum).then((page) => {
      //pageLoaded(page);
      console.log(`page ${pageNum} is loaded`);
      setPage(page);
      return true;
    });
  });
  const items = [];
  if (notes) {
    Object.keys(notes).forEach((key) => {
      const n = notes[key];
      // eslint-disable-next-line react/prop-types
      if (n.page === pageNum && n.fileId == fileId) {
        items.push(<StaticRect nid={key} key={key} />);
      }
    });
  }

  if (page) {
    console.log(`page ${pageNum} is ready`);
    return (
      <>
        <SelectRect />
        {items}
        <PdfPage pdfPage={page} />
      </>
    );
  }

  return <p>loading page</p>;
};
