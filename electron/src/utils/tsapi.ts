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
  ServerGetAllDocumentsCached,
  ServerOpenDocument,
  ServerGetPage,
  ServerGetAllNotes,
  ServerGetAllNotesCached,
  ServerLoadNoteImage,
} from './XtNoteServerApi';


export const NeoDbDataApi: DataApi = {
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
  GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
};

export const XtNoteServerDataApi: DataApi = {
  Initialize: ServerInitialize,
  Login: ServerLogin,
  GetAllActiveDocuments: ServerGetAllDocumentsCached,
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
  GetAllActiveNotes: ServerGetAllNotesCached,
  GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
};

export const CachedDataApi: DataApi = {
  Initialize: CacheInitialize,
  Login: ()=>{}
  GetAllActiveDocuments: GetAllDocumentsCached,
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
  GetAllActiveNotes: ServerGetAllNotesCached,
  GetAllTodosPromise,
  GetNoteByUuid,
  UpdateNotePromise,
};

export function getDataApi(): DataApi {
  //return NeoDbDataApi;
  return XtNoteServerDataApi;
}
