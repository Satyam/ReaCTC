import { NAME } from './constants';

export function selCelda(state, idSector, coords) {
  return state[NAME][`${idSector}:${coords}`];
}

export default selCelda;
