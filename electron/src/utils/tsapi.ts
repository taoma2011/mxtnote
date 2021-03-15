import {
  GetAllActiveDocuments,
  AddDocument,
  UpdateDocument,
  DeleteDocument,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,
  UpdateNote,
  DeleteNote,
  GetAllDocumentsPromise,
  GetAllNotesPromise,
  GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
} from './db';

import { OpenPdfFile, GetPdfPage, LoadNoteImage } from './pdfutils';
import { Document, Note, RuntimeDocument, Todo, DataApi } from './interface';

import {
  ServerInitialize,
  ServerLogin,
  ServerGetAllDocuments,
  ServerOpenDocument,
  ServerGetPage,
  ServerGetAllNotes,
  ServerLoadNoteImage,
  ServerGetAllTodos,
  ServerUpdateNote,
  ServerAddDocument,
  ServerDeleteDocument,
} from './XtNoteServerApi';

export const NeoDbDataApi: DataApi = {
  cache: null,
  IsLocal: () => true,
  Initialize: () => 'initialized',
  Login: () => {},
  GetAllActiveDocuments,
  OpenDocument: OpenPdfFile,
  GetDocumentPage: GetPdfPage,
  AddDocument,
  UpdateDocument,
  DeleteDocumentByFileId: DeleteDocument,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,
  LoadNoteImage,
  UpdateNote: UpdateNotePromise,
  DeleteNote,
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
  GetAllActiveDocuments: ServerGetAllDocuments,
  OpenDocument: ServerOpenDocument,
  GetDocumentPage: ServerGetPage,
  AddDocument: (file: any) =>
    ServerAddDocument(XtNoteServerDataApi.cache)(file),
  UpdateDocument,
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
  DeleteNote,
  GetAllDocumentsPromise,
  GetAllActiveNotes: () => ServerGetAllNotes(XtNoteServerDataApi.cache),
  GetAllTodos: ServerGetAllTodos,
  GetNoteByUuid,
  // UpdateNotePromise,
};

export function getDataApi(isLocal: boolean): DataApi {
  if (isLocal) return NeoDbDataApi;
  return XtNoteServerDataApi;
}
