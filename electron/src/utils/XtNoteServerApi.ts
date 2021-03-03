import axios from 'axios';
import { OpenPdfData, GetPdfPage, getImageFromPdfPage } from './pdfutils';
import { GetAllActiveDocuments } from './db';
import { Document, Note, RuntimeDocument, Todo } from './interface';
import { remoteNoteToLocalNote } from './api';

const uuid = require('uuid');

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
    // await afterLogin();
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

export const ServerGetAllDocuments = async (): Promise<Document[]> => {
  console.log('server get all documents');
  if (!token) {
    return [];
  }
  try {
    const res = await axios.get(`${getBaseUrl()}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('document ', res);
    return res.data.map((f: any) => remoteFileToLocal(f));
  } catch (e) {
    console.log('get all documents erropr ', e);
    return [];
  }
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

export const ServerLoadNoteImage = async (noteId: string) => {
  return null;
};

/*
 * example note from server:
 *
  createdDate: "2020-07-19T06:18:26.497Z"
  detail: "fffg↵hhh"
  fileId: "5ef8603500d4e368b5b3eba5"
  height: 0.05891443132745299
  id: "5f13e5b2c06ccd6587b3e76b"
  lastModifiedTime: "2021-02-14T03:14:35.435Z"
  lastSynced: "2021-02-14T03:14:35.435Z"
  noteUuid: "5f13e5b2c06ccd6587b3e76b"
  originalDevice: "962f496a15ebae6bffb3b52414def99c3ec2f7fac587c4e18700cc486e54c323:xtserver"
  page: 2
  pageX: 0.4966998052230545
  pageY: 0.8628248876335339
  sketchBase64: "AQBiALYAYgC1AGIAtQBkALQAZgCyAGkAsABvAK4AdgCqAH0ApQCEAKAAjACbAJQAlgCbAJIAogCOAKoAigCwAIgAtgCGALwAhADBAIQAxQCEAMoAhQDOAIYA0QCHANQAiQDXAIwA2QCPANsAkgDdAJcA3gCcAN4AowDdAKoA3ACyANoAuQDXAMEA1ADJANEA0ADNANcAyQDdAMUA4wDBAOgAvQDrALkA7gC1APEAsQDzAK4A9QCrAPYAqAD4AKYA+ACiAPkAoAD5AJ4A+QCcAPgAmgD4AJkA9wCYAPYAlwD2AJcA9QCXAPQAlwD0AJgA8wCZAPIAmQDxAJoA8ACcAO8AngDuAKAA7QCiAOsApADpAKYA6ACoAOYAqgDkAKwA4gCvAOAAsQDeALMA3AC1ANoAuADYALoA1wC8ANYAvQDVAL4A1AC/ANQAwADUAMEA1ADCANUAwgDWAMMA1wDDANgAxADaAMUA3ADGAN4AxwDgAMgA4QDJAOMAygDlAMsA5wDMAOkAzgDrAM8A7QDPAPAA0ADyANEA9QDRAPgA0QD6ANEA/gDRAAEB0QAFAdEACAHPAAwBzgAPAc0AEwHLABYByQAZAcYAHQHDACABwQAiAb4AJAG6ACYBtwAoAbQAKQGxACsBrQArAakALAGmAC0BogAtAZ4ALQGaAC0BlgAsAZMAKwGPACoBjAApAYkAJwGGACYBgwAkAYEAIgF/ACABfQAeAXwAGwF6ABkBegAYAXoAFwF6ABYBfAAUAX0AEwF/ABIBggARAYQAEQGHABEBigARAY4AEQGSABIBAAAAAA=="
  syncRecord: "{"id":"6fedeb43-d790-4977-bbe2-d3a000bb3158","children":[{"id":"ac2cdc9e-8657-4a63-8787-a3099018b87c"}]}"
  tags: []
  userId: "5ef8603500d4e368b5b3eba4"
  width: 0.3527480507596744
*/
export const ServerGetAllNotes = async (cache: any): Promise<Note[]> => {
  if (!token) {
    return [];
  }

  try {
    const res = await axios.get(`${getBaseUrl()}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('notes ', res);
    return res.data
      .map((remoteNote: any) => {
        const f = cache.GetDocumentById(remoteNote.fileId);
        // somehow some file doesnt have width, older version?
        if (!f || !f.width) {
          return null;
        }
        return remoteNoteToLocalNote(cache, f, remoteNote);
      })
      .filter((n: any) => n !== null);
  } catch (e) {
    console.log('get all notes error ', e);
  }
  return [];
};

export const ServerGetAllTodos = async (): Promise<Todo[]> => {
  if (!token) {
    return [];
  }

  try {
    const res = await axios.get(`${getBaseUrl()}/tags`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('todos ', res);
    return res.data.map((t: any) => {
      return {
        id: t.id ? t.id : uuid.v4(),
        description: t.name,
      };
    });
  } catch (e) {
    console.log('get all todos error ', e);
  }
  return [];
};
