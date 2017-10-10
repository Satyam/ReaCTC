import { selIsPending } from '_store/selectors';
import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

import { CLICK_SENAL } from './constants';

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
  return async (dispatch, getState, database) => {
    await dispatch(setPending(idSenal, luz));
    await database.ref(`senales/${idSenal}/${luz}/estado`).set(estado);
    await dispatch(setEnclavamientos(idSenal, estado));
  };
}

export function setLuzEstado(idSenal, luz, estado) {
  return async (dispatch, getState, database) => {
    const senal = await database.ref(`senales/${idSenal}/${luz}`).once('value');
    if (senal.estado === estado) {
      return;
    }
    if (selIsPending(getState(), idSenal, luz)) {
      throw new Error(`Senal ${idSenal}/${luz} error: loop por enclavamiento`);
    }
    await dispatch(doSetLuzEstado(idSenal, luz, estado));
    await dispatch(clearAllPending());
  };
}

export function setLuzManual(idSenal, luz, manual) {
  return (dispatch, getState, database) =>
    database.ref(`senales/${idSenal}/${luz}/manual`).set(manual);
}
