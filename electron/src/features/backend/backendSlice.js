import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ADD_NOTE, DELETE_NOTE } from '../../actions/file';

const initialState = {};

export const updateNote = createAsyncThunk(
  'backend/updateNote',
  async (data) => {
    const { dataApi, noteId, note } = data;
    const ret = await dataApi.UpdateNote(noteId, note);
    return ret;
  }
);

export const updateEditingNoteRect = createAsyncThunk(
  'backend/updateEditingNoteRect',
  async (data, thunkAPI) => {
    const fileState = thunkAPI.getState().file;
    const { dataApi } = fileState;
    const n = dataApi.GetNoteById(fileState.editingNid);
    n.top = fileState.rect.top;
    n.left = fileState.rect.left;
    n.width = fileState.rect.width;
    n.height = fileState.rect.height;
    n.image = null;
    n.imageFile = null;
    dataApi.UpdateNote(fileState.editingNid, n);
  }
);

export const deleteNote = createAsyncThunk(
  'backend/deleteNote',
  async (data, thunkAPI) => {
    const { noteId } = data;
    const fileState = thunkAPI.getState().file;
    const { dataApi } = fileState;

    await dataApi.DeleteNote(noteId);
    thunkAPI.dispatch({
      type: DELETE_NOTE,
      noteId,
    });
  }
);

export const createNote = createAsyncThunk(
  'backend/createNote',
  async (data, thunkAPI) => {
    const { x, y } = data;
    const fileState = thunkAPI.getState().file;
    const { dataApi } = fileState;
    const now = new Date();
    const defaultNote = {
      fileId: fileState.fileId,
      page: fileState.pageNum,
      width: 100,
      height: 100,
      top: (y * 100) / fileState.scale,
      left: (x * 100) / fileState.scale,
      angle: 0,
      text: 'new note',
      todoDependency: [],
      scale: fileState.scale,
      image: null,
      imageFile: null,
      created: now,
      lastModified: now,
    };
    console.log('create default note ', defaultNote);
    const newNid = await dataApi.CreateNote(defaultNote);
    console.log('new note id is ', newNid);
    thunkAPI.dispatch({
      type: ADD_NOTE,
      newNid,
      note: defaultNote,
    });
  }
);

const backendSlice = createSlice({
  name: 'backend',
  initialState,
  reducers: {},
  extraReducers: {
    [updateNote.fulfilled]: (state, action) => {
      console.log('got update note fulfiled');
    },
    [createNote.fulfilled]: (state, action) => {
      console.log('got create note fulfiled');
    },
  },
});

export default backendSlice.reducer;
// should put the dataApi here too?
