import omit from 'lodash/omit';

import NAME from './constants';

export function sectoresLoaded(state) {
  return !!state[NAME].$loaded;
}

export function sectoresList(state) {
  return omit(state[NAME], '$loaded');
}

export function sectorLoaded(state, idSector) {
  return idSector in state[NAME] && state[NAME][idSector].$loaded;
}

export function sectorItem(state, idSector) {
  return omit(state[NAME][idSector], '$loaded') || {};
}
