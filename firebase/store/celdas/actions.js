import { selIsPending } from '_store/selectors';
import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

import { CLICK_CELDA } from './constants';

export function clickCelda(idCelda, tipo) {
  return {
    type: CLICK_CELDA,
    payload: {
      idCelda,
      tipo,
    },
  };
}

export function doSetCambio(idCelda, posicion) {
  return async (dispatch, getState, database) => {
    const snapshot = await database.ref(`celdas/${idCelda}`).once('value');
    const celda = snapshot.val();
    if (celda.tipo !== 'cambio' && celda.tipo !== 'triple') {
      throw new Error(`Celda ${idCelda}  no es un cambio`);
    }
    if (celda.posicion === posicion) {
      return;
    }
    if (selIsPending(getState(), idCelda)) {
      throw new Error(`Celda ${idCelda} error: loop por enclavamiento`);
    }
    await dispatch(setPending(idCelda));
    await database.ref(`celdas/${idCelda}/posicion`).set(posicion);
    await dispatch(setEnclavamientos(idCelda, posicion));
  };
}

export function setCambio(idCelda, posicion) {
  return async (dispatch) => {
    await dispatch(doSetCambio(idCelda, posicion));
    await dispatch(clearAllPending());
  };
}

export function setCambioManual(idCelda, manual) {
  return (dispatch, getState, database) => database.ref(`celdas/${idCelda}/manual`).set(manual);
}
