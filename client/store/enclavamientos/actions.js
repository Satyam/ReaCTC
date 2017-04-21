import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export function setPending(idSector, coords) {
  return {
    type: SET_PENDING,
    payload: {
      idSector,
      coords,
    },
  };
}

export function clearAllPending() {
  return { type: CLEAR_ALL_PENDING };
}
