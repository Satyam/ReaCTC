import { clearAllPending } from '_store/actions';

import { CLICK_SENAL, SET_ESTADO_LUZ, SET_LUZ_MANUAL } from './constants';

export function clickSenal(idSenal) {
  return {
    type: CLICK_SENAL,
    payload: {
      idSenal,
      tipo: 'senal',
    },
  };
}
export function doSetLuzEstado(idSenal, luz, estado) {
  return {
    type: SET_ESTADO_LUZ,
    payload: {
      idSenal,
      luz,
      estado,
    },
  };
}

export function setLuzEstado(idSenal, luz, estado) {
  return async (dispatch) => {
    await dispatch(doSetLuzEstado(idSenal, luz, estado));
    await dispatch(clearAllPending());
  };
}

export function setLuzManual(idSenal, luz, manual) {
  return {
    type: SET_LUZ_MANUAL,
    payload: {
      idSenal,
      luz,
      manual,
    },
  };
}
