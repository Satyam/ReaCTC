import { NAME } from './constants';

export function selEnclavamientos(state, enclavamiento) {
  return state[NAME].hash[enclavamiento];
}

export function selIsPending(state, idSector, coords) {
  return state[NAME].pending.indexOf(`${idSector}:${coords}`) !== -1;
}
