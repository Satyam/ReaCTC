import { CLICK_SENAL, SET_ESTADO_LUZ, SET_LUZ_MANUAL } from './constants';

export function clickSenal(idSector, coords, dir) {
  return {
    type: CLICK_SENAL,
    payload: {
      idSector,
      coords,
      dir,
      tipo: 'senal',
    },
  };
}
export function setLuzEstado(idSector, coords, dir, luz, estado) {
  return {
    type: SET_ESTADO_LUZ,
    payload: {
      idSector,
      coords,
      dir,
      luz,
      estado,
    },
  };
}
export function setLuzManual(idSector, coords, dir, luz, manual) {
  return {
    type: SET_LUZ_MANUAL,
    payload: {
      idSector,
      coords,
      dir,
      luz,
      manual,
    },
  };
}
