import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type FileStateType = {
  +fileName: string,
  +viewerOpen: boolean
};
export type StateType = {
  +counter: number,
  +file: FileStateType
};

export type Action = {
  +type: string,
  +top: number,
  +left: number,
  +width: number,
  +height: number,
  +angle: number
};

export type GetState = () => StateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
