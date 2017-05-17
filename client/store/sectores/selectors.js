import { NAME } from './constants';

export function selSectoresLoaded(state) {
  return !!state[NAME].$loaded;
}

export function selSectores(state) {
  return state[NAME].list;
}

export function selSectorRequested(state, idSector) {
  return idSector in state[NAME].hash;
}

export function selSector(state, idSector) {
  return state[NAME].hash[idSector] || {};
}
