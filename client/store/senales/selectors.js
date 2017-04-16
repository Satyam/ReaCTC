import NAME from './constants';

export function senalItem(state, idSector, coords, dir) {
  return state[NAME][`${idSector}:${coords}:${dir}`];
}
