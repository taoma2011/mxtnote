import axios from 'axios';
import { OpenPdfData, GetPdfPage } from '../utils/pdfutils';

const BASE_URL = 'https://note.mxtsoft.com:4001';
const TEST_BASE_URL = 'http://localhost:4001';

const getBaseUrl = () => {
  return BASE_URL;
};

let token: any;

export const ServerInitialize = () => {
  // check if we have saved token
  return 'login-needed';
};

export const ServerLogin = async (user: string, pass: string) => {
  try {
    const res = await axios.post(`${getBaseUrl()}/users/authenticate`, {
      username: user,
      password: pass,
    });
    console.log('login get ', res);
    token = res.data.token;
    return true;
  } catch (e) {
    console.log('log in error ', e);
    return false;
  }
};

/*
 * example return:
 *
  createdDate: "2020-06-28T09:17:41.794Z"
  fileUuid: "5ef8603500d4e368b5b3eba5"
  filename: "berger Bloch kato"
  height: 792
  id: "5ef8603500d4e368b5b3eba5"
  numPages: 22
  originalDevice: "4a748b41311a59ef4323a783d8e0500344e933618816ae8b69a23765290dc80a:xtserver"
  username: "tao"
  width: 612
*/

const remoteFileToLocal = (f: any) => {
  return {
    ...f,
    file: 'remote',
    description: f.filename,
  };
};

export const ServerGetAllDocuments = (handleDoc: any) => {
  console.log('XXX token ', token);
  if (!token) {
    return;
  }
  axios
    .get(`${getBaseUrl()}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log('document ', res);
      handleDoc(res.data.map((f: any) => remoteFileToLocal(f)));
      return true;
    })
    .catch((e) => {
      console.log('get all documents erropr ', e);
    });
};

interface XtDocument {
  file: any;
  numPages: number;
  pages: { [pageNumber: string]: any };
}

export const ServerOpenDocument = async (f: any): Promise<XtDocument> => {
  // make a structure to manage each page
  const doc: XtDocument = { file: f, numPages: f.numPages, pages: {} };
  return doc;
};

export const ServerGetPage = async (doc: any, pageNum: number) => {
  const xd = doc as XtDocument;
  const page = xd.pages[pageNum];
  if (page) {
    return page;
  }
  try {
    const res = await axios.get(
      // xtnote server page number start with 0
      `${getBaseUrl()}/files/page-pdf/${xd.file.id}/${pageNum - 1}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('page pdf return ', res);
    const pdfDoc = await OpenPdfData(res.data);
    const pdfPage = await GetPdfPage(pdfDoc, 1);
    xd.pages[pageNum] = pdfPage;
    return pdfPage;
  } catch (e) {
    console.log('server get page exception ', e);
  }
  return null;
};
