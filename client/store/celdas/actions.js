import {
  CLICK_CELDA,
  SET_CAMBIO,
  SET_TRIPLE,
  SET_CAMBIO_MANUAL,
  SET_ESTADO_LUZ,
  SET_LUZ_MANUAL,
} from './constants';

export function clickCelda(idSector, coords) {
  return {
    type: CLICK_CELDA,
    payload: {
      idSector,
      coords,
    },
  };
}

export function setCambio(idSector, coords, desviado) {
  return {
    type: SET_CAMBIO,
    payload: {
      idSector,
      coords,
      desviado,
    },
  };
}

export function setTriple(idSector, coords, posicion) {
  return {
    type: SET_TRIPLE,
    payload: {
      idSector,
      coords,
      posicion,
    },
  };
}

export function setCambioManual(idSector, coords, manual) {
  return {
    type: SET_CAMBIO_MANUAL,
    payload: {
      idSector,
      coords,
      manual,
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
