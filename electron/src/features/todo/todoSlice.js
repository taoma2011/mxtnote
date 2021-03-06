import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataApiFromThunk } from '../../utils/common';
import { GetSettings } from '../../utils/db';

const initialState = {};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    todoAdded: {
      reducer(state, action) {},
      prepare(newTodoId) {
        return {
          payload: {
            newTodoId,
          },
        };
      },
    },
  },
});

export default todoSlice.reducer;

export const addTodo = createAsyncThunk('todo/add', async (data, thunkAPI) => {
  const { todo } = data;
  const dataApi = getDataApiFromThunk(thunkAPI);
  const newTodoId = await dataApi.CreateTodo(todo);
  thunkAPI.dispatch(todoSlice.actions.todoAdded(newTodoId));
});

export const editTodo = createAsyncThunk(
  'todo/edit',
  async (data, thunkAPI) => {
    const { todo } = data;
    const dataApi = getDataApiFromThunk(thunkAPI);
    await dataApi.UpdateTodo(todo.id, todo);
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/delete',
  async (data, thunkAPI) => {
    const { todo } = data;
    const dataApi = getDataApiFromThunk(thunkAPI);
    await dataApi.DeleteTodo(todo.id);
  }
);

export const { todoAdded } = todoSlice.actions;
