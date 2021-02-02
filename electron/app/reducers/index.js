// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import type { HashHistory } from "history";
import file from "./file";
import search from "../features/search/searchSlice";

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    file,
    search,
  });
}

// eslint-disable-next-line flowtype/no-weak-types
export function getMainState(state: any) {
  return state.file;
}
