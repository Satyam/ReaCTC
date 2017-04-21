import { NAME } from './constants';

export function selEnclavamientos(state, idSector, coords) {
  return state[NAME].hash[`${idSector}:${coords}`];
}

export function selIsPending(state, idSector, coords) {
  return state[NAME].pending.indexOf(`${idSector}:${coords}`) !== -1;
}
