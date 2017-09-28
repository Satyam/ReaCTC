import { selCelda, selIsPending } from '_store/selectors';

import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

import { CLICK_CELDA, SET_CAMBIO, SET_CAMBIO_MANUAL } from './constants';

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
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idCelda);
    if (celda.tipo !== 'cambio' && celda.tipo !== 'triple') {
      return Promise.reject(`Celda ${idCelda}  no es un cambio`);
    }
    if (celda.posicion === posicion) {
      return Promise.resolve();
    }
    if (selIsPending(getState(), idCelda)) {
      return Promise.reject(`Celda ${idCelda} error: loop por enclavamiento`);
    }
    return Promise.resolve(dispatch(setPending(idCelda)))
      .then(() =>
        dispatch({
          type: SET_CAMBIO,
          payload: {
            idCelda,
            posicion,
          },
          wsMode: BUNDLE === 'wsClient' && 'all',
        })
      )
      .then(() => dispatch(setEnclavamientos(idCelda)));
  };
}

export function setCambio(idCelda, posicion) {
  return dispatch =>
    dispatch(doSetCambio(idCelda, posicion)).then(() => dispatch(clearAllPending()));
}

export function setCambioManual(idCelda, manual) {
  return dispatch =>
    Promise.resolve(
      dispatch({
        type: SET_CAMBIO_MANUAL,
        payload: {
          idCelda,
          manual,
        },
      })
    ).then(() => dispatch(setEnclavamientos(idCelda)));
}
