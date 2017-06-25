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
export function setLuzEstado(idSenal, luz, estado) {
  return {
    type: SET_ESTADO_LUZ,
    payload: {
      idSenal,
      luz,
      estado,
    },
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
