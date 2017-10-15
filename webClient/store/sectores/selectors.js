// @flow
import type { State } from '_store/flowtypes';

import { NAME } from './constants';

export function selSectoresRequested(state: State): boolean {
  return state[NAME].list.requested;
}

export function selSectores(state: State): SectorListEntry[] {
  return state[NAME].list.list;
}

export function selStatusAdmin(state: State): AdminStatusItem[] {
  return state[NAME].adminStatus;
}

export function selSectorRequested(state: State, idSector: IdType): boolean {
  return idSector in state[NAME].hash;
}

export function selSector(state: State, idSector: IdType): SectorType {
  return state[NAME].hash[idSector];
}
