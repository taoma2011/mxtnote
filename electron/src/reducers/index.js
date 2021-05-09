// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import file from './file';
import search from '../features/search/searchSlice';
import backend from '../features/backend/backendSlice';
import note from '../features/note/noteSlice';

export default function createRootReducer(history) {
  return combineReducers({
    // router: connectRouter(history),
    file,
    search,
    backend,
    note,
  });
}

// eslint-disable-next-line flowtype/no-weak-types
export function getMainState(state) {
  return state.file;
}
