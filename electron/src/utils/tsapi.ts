import {
  GetAllActiveDocuments,
  LocalAddDocument,
  LocalUpdateDocument,
  LocalDeleteDocument,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  //UpdateTodo,
  //DeleteTodo,
  LocalUpdateNote,
  LocalCreateNote,
  LocalDeleteNote,
  LocalCreateTodo,
  LocalUpdateTodo,
  LocalDeleteTodo,
  GetAllDocumentsPromise,
  GetAllNotesPromise,
  GetAllTodos,
  GetNoteByUuid,
  DeleteSettings,
} from './db';

import { OpenPdfFile, GetPdfPage, LoadNoteImage } from './pdfutils';
import { Document, Note, RuntimeDocument, Todo, DataApi } from './interface';

import {
  ServerInitialize,
  ServerLogin,
  ServerLoginWithToken,
  ServerGetAllDocuments,
  ServerOpenDocument,
  ServerGetPage,
  ServerGetAllNotes,
  ServerLoadNoteImage,
  ServerGetAllTodos,
  ServerUpdateNote,
  ServerCreateNote,
  ServerDeleteNote,
  ServerCreateTodo,
  ServerUpdateTodo,
  ServerDeleteTodo,
  ServerAddDocument,
  ServerDeleteDocument,
} from './XtNoteServerApi';

export const NeoDbDataApi: DataApi = {
  cache: null,
  IsLocal: () => true,
  Initialize: () => 'initialized',
  Login: () => {},
  LoginWithToken: () => {},
  GetAllActiveDocuments,
  OpenDocument: OpenPdfFile,
  GetDocumentPage: GetPdfPage,
  AddDocument: (doc: Document) => LocalAddDocument(NeoDbDataApi.cache)(doc),
  UpdateDocument: (id: string, doc: Document) =>
    LocalUpdateDocument(NeoDbDataApi.cache)(id, doc),
  DeleteDocumentByFileId: (fileId: string) =>
    LocalDeleteDocument(NeoDbDataApi.cache)(fileId),
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,

  // is this still needed?
  LoadNoteImage,

  CreateNote: (note: Note) => LocalCreateNote(NeoDbDataApi.cache)(note),
  UpdateNote: (noteId: string, note: Note) =>
    LocalUpdateNote(NeoDbDataApi.cache)(noteId, note),
  DeleteNote: (noteId: string) => LocalDeleteNote(NeoDbDataApi.cache)(noteId),

  CreateTodo: (todo: Todo) => LocalCreateTodo(NeoDbDataApi.cache)(todo),
  UpdateTodo: (id: string, todo: Todo) =>
    LocalUpdateTodo(NeoDbDataApi.cache)(id, todo),
  DeleteTodo: (noteId: string) => LocalDeleteTodo(NeoDbDataApi.cache)(noteId),

  DeleteSettings,

  GetAllDocumentsPromise,
  GetAllActiveNotes: GetAllNotesPromise,
  GetAllTodos,
  GetNoteByUuid,
  // UpdateNotePromise,
};

export const XtNoteServerDataApi: DataApi = {
  cache: null,
  IsLocal: () => false,
  Initialize: ServerInitialize,
  Login: ServerLogin,
  LoginWithToken: ServerLoginWithToken,
  GetAllActiveDocuments: ServerGetAllDocuments,
  OpenDocument: ServerOpenDocument,
  GetDocumentPage: ServerGetPage,
  AddDocument: (file: any) =>
    ServerAddDocument(XtNoteServerDataApi.cache)(file),
  UpdateDocument: async () => {
    console.log('not supported');
    return false;
  },
  DeleteDocumentByFileId: (fileId: string) =>
    ServerDeleteDocument(XtNoteServerDataApi.cache)(fileId),
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  CreateTodo: (todo: Todo) => ServerCreateTodo(XtNoteServerDataApi.cache)(todo),
  UpdateTodo: (id: string, todo: Todo) =>
    ServerUpdateTodo(XtNoteServerDataApi.cache)(id, todo),
  DeleteTodo: (id: string) => ServerDeleteTodo(XtNoteServerDataApi.cache)(id),
  LoadNoteImage: ServerLoadNoteImage,
  CreateNote: (note: Note) => ServerCreateNote(XtNoteServerDataApi.cache)(note),
  UpdateNote: (id: string, note: Note) =>
    ServerUpdateNote(XtNoteServerDataApi.cache)(id, note),
  DeleteNote: (id: string) => ServerDeleteNote(XtNoteServerDataApi.cache)(id),

  DeleteSettings: () => {},
  GetAllDocumentsPromise,
  GetAllActiveNotes: () => ServerGetAllNotes(XtNoteServerDataApi.cache),
  GetAllTodos: ServerGetAllTodos,
  GetNoteByUuid,
  // UpdateNotePromise,
};

export function getDataApi(isLocal: boolean): DataApi {
  console.log('get data api, local = ', isLocal);
  if (isLocal) return NeoDbDataApi;
  return XtNoteServerDataApi;
}
