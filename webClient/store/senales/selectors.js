import { NAME } from './constants';

export function selSenal(state, idSector, coords, dir) {
  return state[NAME][`${idSector}:${coords}:${dir}`];
}

export function selSenalIsManual(state, idSector, coords, dir, luz) {
  return state[NAME][`${idSector}:${coords}:${dir}`][luz].manual;
}

export default selSenal;
