// @flow
import type { AsyncActionCreator } from '_store/flowtypes';
import { selCelda, selIsPending } from '_store/selectors';

import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

import { CLICK_CELDA, SET_CAMBIO, SET_CAMBIO_MANUAL } from './constants';
import type { ClickCeldaAction } from './flowtypes';

export function clickCelda(idCelda: IdType, tipo: ActiveCeldasTypeType): ClickCeldaAction {
  return {
    type: CLICK_CELDA,
    payload: {
      idCelda,
      tipo,
    },
  };
}

export function doSetCambio(idCelda: IdType, posicion: PosicionesType): AsyncActionCreator<void> {
  return async (dispatch, getState) => {
    const celda = selCelda(getState(), idCelda);
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
    await dispatch({
      type: SET_CAMBIO,
      payload: {
        idCelda,
        posicion,
      },
      wsMode: BUNDLE === 'wsClient' && 'all',
    });
    await dispatch(setEnclavamientos(idCelda));
  };
}

export function setCambio(idCelda: IdType, posicion: PosicionesType): AsyncActionCreator<void> {
  return async (dispatch) => {
    await dispatch(doSetCambio(idCelda, posicion));
    await dispatch(clearAllPending());
  };
}

export function setCambioManual(idCelda: IdType, manual: boolean): AsyncActionCreator<void> {
  return async (dispatch) => {
    await dispatch({
      type: SET_CAMBIO_MANUAL,
      payload: {
        idCelda,
        manual,
      },
    });
    await dispatch(setEnclavamientos(idCelda));
  };
}
