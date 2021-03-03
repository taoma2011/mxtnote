import { Document, Note, RuntimeDocument, Todo, DataApi } from './interface';
import { getImageFromPdfPage } from './pdfutils';

let fileCache: Document[] = [];
let noteCache: Note[] = [];
let bApi: DataApi;

export const CacheGetAllDocument = (): Document[] => {
  return fileCache;
};

export const CacheGetAllNotes = (): Note[] => {
  return noteCache;
};

const getDocumentById = (id: string): Document | null => {
  let res = null;
  fileCache.forEach((f: Document) => {
    if (f.id === id) {
      res = f;
    }
  });
  return res;
};

const getNoteById = (id: string): Note | null => {
  let res = null;
  noteCache.forEach((n: Note) => {
    if (n.id === id) {
      res = n;
    }
  });
  return res;
};

export const CreateCache = async (backendApi: any): Promise<DataApi> => {
  bApi = backendApi;
  const cache = {
    ...backendApi,
    GetCachedDocuments: CacheGetAllDocument,
    GetCachedNotes: CacheGetAllNotes,
    LoadNoteImage: CacheLoadNoteImage,
    GetDocumentById: getDocumentById,
    GetNoteById: getNoteById,
  };

  // make the Get...ById api available to backend
  backendApi.cache = cache;

  fileCache = await bApi.GetAllActiveDocuments();
  noteCache = await bApi.GetAllActiveNotes();
  console.log('note cache is ', noteCache);

  return cache;
};

export const CacheLoadNoteImage = async (noteId: string) => {
  const n = getNoteById(noteId);
  if (!n) {
    return null;
  }
  const f = getDocumentById(n.fileId);
  if (!f) {
    return null;
  }
  const pdfFile = await bApi.OpenDocument(f);
  const pdfPage = await bApi.GetDocumentPage(pdfFile, n.page);
  const image = await getImageFromPdfPage(n, pdfPage);
  return image;
};
