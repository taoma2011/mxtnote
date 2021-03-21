import { Document, Note, RuntimeDocument, Todo, DataApi } from './interface';
import { getImageFromPdfPage } from './pdfutils';

let fileCache: Document[] = [];
let noteCache: Note[] = [];
let todoCache: Todo[] = [];
let bApi: DataApi;

export const CacheGetAllDocument = (): Document[] => {
  return fileCache;
};

export const CacheGetAllNotes = (): Note[] => {
  return noteCache;
};

export const CacheGetAllTodos = (): Todo[] => {
  return todoCache;
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

const getTodoByDescription = (desc: string): Todo | null => {
  let res = null;
  todoCache.forEach((t: Todo) => {
    if (t.description === desc) {
      res = t;
    }
  });
  return res;
};

const getTodoById = (id: string): Todo | null => {
  let res = null;
  todoCache.forEach((t: Todo) => {
    if (t.id === id) {
      res = t;
    }
  });
  return res;
};

const setNoteById = (id: string, note: Note): void => {
  for (let i = 0; i < noteCache.length; i += 1) {
    if (noteCache[i].id === id) {
      noteCache.splice(i, 1, note);
      return;
    }
  }
};

export const FillFileCache = async () => {
  fileCache = await bApi.GetAllActiveDocuments();
  console.log('file cache is refilled');
};

export const FillNoteCache = async () => {
  noteCache = await bApi.GetAllActiveNotes();
  console.log('note cache filled');
};

export const FillTodoCache = async () => {
  todoCache = await bApi.GetAllTodos();
  console.log('todo cache filled');
};

export const CreateCache = async (backendApi: any): Promise<DataApi> => {
  bApi = backendApi;
  const cache = {
    ...backendApi,
    GetCachedDocuments: CacheGetAllDocument,
    GetCachedNotes: CacheGetAllNotes,
    GetCachedTodos: CacheGetAllTodos,
    LoadNoteImage: CacheLoadNoteImage,
    GetDocumentById: getDocumentById,
    GetNoteById: getNoteById,
    GetTodoByDescription: getTodoByDescription,
    GetTodoById: getTodoById,
    SetNoteById: setNoteById,

    FillFileCache,
    FillNoteCache,
    FillTodoCache,
  };

  // make the Get...ById api available to backend
  backendApi.cache = cache;

  await FillFileCache();

  todoCache = await bApi.GetAllTodos();
  noteCache = await bApi.GetAllActiveNotes();
  console.log('todo cache is ', todoCache);

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
