import { NAME } from './constants';

export function selSenal(state, idSector, coords, dir) {
  return state[NAME][`${idSector}:${coords}:${dir}`];
}

export default selSenal;
