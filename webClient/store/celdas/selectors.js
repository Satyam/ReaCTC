import { NAME } from './constants';

export function selCelda(state, idCelda) {
  return state[NAME][idCelda];
}

export default selCelda;
