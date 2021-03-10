import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {};

export const updateNote = createAsyncThunk(
  'backend/updateNote',
  async (data) => {
    const { dataApi, noteId, note } = data;
    const ret = await dataApi.UpdateNote(noteId, note);
    return ret;
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
  },
});

export default backendSlice.reducer;
// should put the dataApi here too?
