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
import { ServerInitialize, ServerLogin } from './XtNoteServerApi';

interface Document {
  createdData: string;
  description: string;
  file: string;
  filename: string;
  fileUuid: string;
  width: number;
  height: number;
  numPages: number;
  username: string;
  originalDevice: string;
  id: string; // same as _id in actual db
}

interface Note {
  fileId: string;
  page: number;
  top: number;
  left: number;
  width: number;
  height: number;
  text: string;
  image: any;
  imageFile: string;
  todoDependency: string[];
  created: string;
  lastModified: string;
  lastSynced: string;
  syncRecord: string;
}

interface Todo {
  description: string;
}

// TODO: implement 17 apis imported by reducers/file.js
interface DataApi {
  Initialize(): string;
  Login(user: string, pass: string): void;
  GetAllActiveDocuments(handler: (doc: Document) => void): void;
  AddDocument(doc: Document): void;
  UpdateDocument(id: string, doc: Document): void;
  DeleteDocumentByFileId(fileId: string): void;
  DeleteAllDocuments(): void;
  DeleteAllNotes(): void;
  DeleteAllTodos(): void;
  UpdateTodo(id: string, todo: Todo): void;
  DeleteTodo(id: string): void;
  UpdateNote(id: string, note: Note, cb: any): void;
  DeleteNote(id: string): void;
  GetAllDocumentsPromise(): Promise<Document>;
  GetAllNotesPromise(): Promise<Note>;
  GetAllTodosPromise(): Promise<Todo>;
  GetNoteByUuid(id: string): Promise<Note>;
  UpdateNotePromise(id: string, note: Note): Promise<Note>;
}

function NeoDbGetAllActiveDocumts(handler: (doc: Document) => void) {
  return GetAllActiveDocuments(handler);
}

export const NeoDbDataApi: DataApi = {
  Initialize: () => 'ok',
  Login: () => {},
  GetAllActiveDocuments,
  AddDocument,
  UpdateDocument,
  DeleteDocumentByFileId: DeleteDocument,
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
};

export const XtNoteServerDataApi: DataApi = {
  Initialize: ServerInitialize,
  Login: ServerLogin,
  GetAllActiveDocuments,
  AddDocument,
  UpdateDocument,
  DeleteDocumentByFileId: DeleteDocument,
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
};

export function getDataApi(): DataApi {
  // return NeoDbDataApi;
  return XtNoteServerDataApi;
}
