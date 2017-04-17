import omit from 'lodash/omit';

import { NAME } from './constants';

export function selSectoresLoaded(state) {
  return !!state[NAME].$loaded;
}

export function selSectores(state) {
  return state[NAME].list;
}

export function selSectorLoaded(state, idSector) {
  return idSector in state[NAME] && state[NAME][idSector].$loaded;
}

export function selSector(state, idSector) {
  return omit(state[NAME][idSector], '$loaded') || {};
}
