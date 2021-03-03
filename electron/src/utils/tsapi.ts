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
} from './XtNoteServerApi';

export const NeoDbDataApi: DataApi = {
  cache: null,
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
  UpdateNote,
  DeleteNote,
  GetAllDocumentsPromise,
  GetAllActiveNotes: GetAllNotesPromise,
  GetAllTodos: GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
};

export const XtNoteServerDataApi: DataApi = {
  cache: null,
  Initialize: ServerInitialize,
  Login: ServerLogin,
  GetAllActiveDocuments: ServerGetAllDocuments,
  OpenDocument: ServerOpenDocument,
  GetDocumentPage: ServerGetPage,
  AddDocument,
  UpdateDocument,
  DeleteDocumentByFileId: DeleteDocument,
  DeleteAllDocuments,
  DeleteAllNotes,
  DeleteAllTodos,
  UpdateTodo,
  DeleteTodo,
  LoadNoteImage: ServerLoadNoteImage,
  UpdateNote,
  DeleteNote,
  GetAllDocumentsPromise,
  GetAllActiveNotes: () => ServerGetAllNotes(XtNoteServerDataApi.cache),
  GetAllTodos: ServerGetAllTodos,
  GetNoteByUuid,
  UpdateNotePromise,
};

export function getDataApi(): DataApi {
  //return NeoDbDataApi;
  return XtNoteServerDataApi;
}
