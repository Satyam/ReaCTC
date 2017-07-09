import { CLICK_CELDA } from './constants';

import { selIsPending } from '_store/selectors';
import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

export function clickCelda(idCelda, tipo) {
  return {
    type: CLICK_CELDA,
    payload: {
      idCelda,
      tipo,
    },
  };
}

export function setCambio(idCelda, posicion) {
  return dispatch =>
    dispatch(doSetCambio(idCelda, posicion)).then(() => dispatch(clearAllPending()));
}

export function doSetCambio(idCelda, posicion) {
  return (dispatch, getState, database) => database
    .ref(`celdas/${idCelda}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then((celda) => {
      if (celda.tipo !== 'cambio' && celda.tipo !== 'triple') {
        return Promise.reject(`Celda ${idCelda}  no es un cambio`);
      }
      if (celda.posicion === posicion) {
        return Promise.resolve();
      }
      if (selIsPending(getState(), idCelda)) {
        return Promise.reject(`Celda ${idCelda} error: loop por enclavamiento`);
      }
      return dispatch(setPending(idCelda))
        .then(() => database.ref(`celdas/${idCelda}/posicion`).set(posicion))
        .then(() => dispatch(setEnclavamientos(idCelda, posicion)));
    });
}

export function setCambioManual(idCelda, manual) {
  return (dispatch, getState, database) => database.ref(`celdas/${idCelda}/manual`).set(manual);
}
