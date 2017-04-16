import { CLICK_CELDA, SET_CAMBIO, SET_TRIPLE, SET_CAMBIO_MANUAL } from './constants';

export function clickCelda(idSector, coords) {
  return {
    type: CLICK_CELDA,
    idSector,
    coords,
  };
}

export function setCambio(idSector, coords, desviado) {
  return {
    type: SET_CAMBIO,
    idSector,
    coords,
    desviado,
  };
}

export function setTriple(idSector, coords, posicion) {
  return {
    type: SET_TRIPLE,
    idSector,
    coords,
    posicion,
  };
}

export function setCambioManual(idSector, coords, manual) {
  return {
    type: SET_CAMBIO_MANUAL,
    idSector,
    coords,
    manual,
  };
}
