import { CLICK_CELDA, SET_CAMBIO, SET_TRIPLE, SET_CAMBIO_MANUAL } from './constants';

export function clickCelda(idSector, coords, tipo) {
  return {
    type: CLICK_CELDA,
    payload: {
      idSector,
      coords,
      tipo,
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
