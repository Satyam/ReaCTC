import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export function setPending(idCelda) {
  return {
    type: SET_PENDING,
    payload: {
      idCelda,
    },
  };
}

export function clearAllPending() {
  return { type: CLEAR_ALL_PENDING };
}
