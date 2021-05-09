import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataApiFromThunk } from '../../utils/common';
import { GetSettings } from '../../utils/db';

const initialState = {
  imageScale: 100,
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    setImageScale: {
      reducer(state, action) {
        console.log('set image scale action: ', action);
        state.imageScale = action.payload.scale;
      },
      prepare(scale) {
        return {
          payload: {
            scale,
          },
        };
      },
    },
  },
});

export default noteSlice.reducer;

export const initializeNoteSettings = createAsyncThunk(
  'note/initializeSettings',
  async (data, thunkAPI) => {
    const s = await GetSettings();
    if (!s) return;
    const { scale } = s;
    if (!scale) return;
    thunkAPI.dispatch(noteSlice.actions.setImageScale(scale));
  }
);

export const { setImageScale } = noteSlice.actions;
