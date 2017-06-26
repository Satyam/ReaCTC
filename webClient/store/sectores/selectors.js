import { NAME } from './constants';

export function selSectoresRequested(state) {
  return state[NAME].list.requested;
}

export function selSectores(state) {
  return state[NAME].list.list;
}

export function selStatusAdmin(state) {
  return state[NAME].adminStatus;
}

export function selSectorRequested(state, idSector) {
  return idSector in state[NAME].hash;
}

export function selSector(state, idSector) {
  return state[NAME].hash[idSector] || {};
}
