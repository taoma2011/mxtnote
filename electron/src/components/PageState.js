import { createContainer } from "unstated-next";

function usePage(pageNum, pdfDoc) {
  let [page, setPage] = useState(null);

  if (pdfDoc) {
    // eslint-disable-next-line react/prop-types
    // eslint-disable-next-line promise/catch-or-return
    pdfDoc.getPage(pageNum).then((page) => {
      pageLoaded(page);
      return true;
    });
  }

  return { page, setPage };
}
