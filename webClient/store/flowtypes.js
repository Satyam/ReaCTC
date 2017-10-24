// @flow
import type { SectoresState, SectoresAction } from './sectores/flowtypes';
import type { CeldasState, CeldasAction } from './celdas/flowtypes';

export type State = {
  sectores: SectoresState,
  celdas: CeldasState,
};

export type Action = SectoresAction | CeldasAction;

export type GetState = () => State;

export type AsyncActionCreator<R> = (
  dispatch: Dispatch<Action>,
  getState: GetState,
) => Promise<R>;

export type Reducer<S = State, A = Action> = (state: S | empty, action: A) => S;
