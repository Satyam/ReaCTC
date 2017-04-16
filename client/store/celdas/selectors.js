import NAME from './constants';

export function celdaSelector(state, idSector, coords) {
  return state[NAME][`${idSector}:${coords}`];
}
