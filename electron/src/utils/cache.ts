import { Document, Note, RuntimeDocument, Todo, DataApi } from './interface';

let fileCache: Document[] = [];
let noteCache: Note[] = [];
let bApi: DataApi;

export const CacheGetAllDocument = async (): Promise<Document[]> => {
  return fileCache;
};

export const CacheGetAllNotes = async (): Promise<Note[]> => {
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
  fileCache = await bApi.GetAllActiveDocuments();
  noteCache = await bApi.GetAllActiveNotes();
  console.log('note cache is ', noteCache);
  return {
    ...backendApi,
    GetAllActiveDocuments: CacheGetAllDocument,
    GetAllActiveNotes: CacheGetAllNotes,
    GetDocumentById: getDocumentById,
    GetNoteById: getNoteById,
  };
};
