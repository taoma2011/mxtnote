// this is the current nedb format
export interface Document {
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

export interface RuntimeDocument {
  numPages: number;
}

export interface Note {
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
  id: string;
}

export interface Todo {
  id: string;
  description: string;
}

export interface CacheApi {
  GetDocumentById(id: string): Document;
  GetNoteById(id: string): Note;
  GetTodoByDescription(desc: string): Todo | null;
  GetTodoById(id: string): Todo | null;
}

// TODO: implement 17 apis imported by reducers/file.js
export interface DataApi {
  cache: CacheApi | null;
  Initialize(): string;
  Login(user: string, pass: string): void;
  GetAllActiveDocuments(): Promise<Document[]>;
  OpenDocument(doc: Document): Promise<RuntimeDocument>;
  GetDocumentPage(docHandle: any, pageNum: number): Promise<any>;
  AddDocument(doc: Document): void;
  UpdateDocument(id: string, doc: Document): void;
  DeleteDocumentByFileId(fileId: string): void;
  DeleteAllDocuments(): void;
  DeleteAllNotes(): void;
  DeleteAllTodos(): void;
  LoadNoteImage(noteId: string): Promise<any>;
  UpdateTodo(id: string, todo: Todo): void;
  DeleteTodo(id: string): void;
  UpdateNote(id: string, note: Note, cb: any): void;
  DeleteNote(id: string): void;
  GetAllDocumentsPromise(): Promise<Document>;
  GetAllActiveNotes(): Promise<any>;
  GetAllTodos(): Promise<Todo[]>;
  GetNoteByUuid(id: string): Promise<Note>;
  UpdateNotePromise(id: string, note: Note): Promise<Note>;

  GetCachedDocuments?(): Document[];
  GetCachedNotes?(): Note[];
  GetCachedTodos?(): Todo[];
  GetDocumentById?(id: string): Document;
  GetNoteById?(id: string): Note;
  GetTodoById?(id: string): Todo | null;
}
