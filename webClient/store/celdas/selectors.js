// @flow
import type { State } from '_store/flowtypes';

import { NAME } from './constants';

export function selCelda(state: State, idCelda: IdType): CeldaType {
  return state[NAME][idCelda];
}

export default selCelda;
