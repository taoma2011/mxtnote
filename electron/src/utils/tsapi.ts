import {
  GetAllActiveDocuments,
  AddDocument,
  UpdateDocument,
  DeleteDocument,
  LocalDeleteDocument,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,
  LocalUpdateNote,
  LocalDeleteNote,
  GetAllDocumentsPromise,
  GetAllNotesPromise,
  GetAllTodosPromise,
  GetNoteByUuid,
  DeleteSettings,
  UpdateNotePromise,
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
  ServerDeleteNote,
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
  AddDocument,
  UpdateDocument,
  DeleteDocumentByFileId: (fileId: string) =>
    LocalDeleteDocument(NeoDbDataApi.cache)(fileId),
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,

  // is this still needed?
  LoadNoteImage,

  UpdateNote: (noteId: string, note: Note) =>
    LocalUpdateNote(NeoDbDataApi.cache)(noteId, note),
  DeleteNote: (noteId: string) => LocalDeleteNote(NeoDbDataApi.cache)(noteId),

  DeleteSettings,

  GetAllDocumentsPromise,
  GetAllActiveNotes: GetAllNotesPromise,
  GetAllTodos: GetAllTodosPromise,
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
  UpdateDocument: () => {
    console.log('not supported');
  },
  DeleteDocumentByFileId: (fileId: string) =>
    ServerDeleteDocument(XtNoteServerDataApi.cache)(fileId),
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,
  LoadNoteImage: ServerLoadNoteImage,
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
