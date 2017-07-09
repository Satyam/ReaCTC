import { CLICK_SENAL } from './constants';
import { selIsPending } from '_store/selectors';
import { setEnclavamientos, setPending, clearAllPending } from '_store/actions';

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
  return (dispatch, getState, database) => database.ref(`senales/${idSenal}/${luz}`).once('value').then((senal) => {
    if (senal.estado === estado) {
      return Promise.resolve();
    }
    if (selIsPending(getState(), idSenal, luz)) {
      return Promise.reject(`Senal ${idSenal}/${luz} error: loop por enclavamiento`);
    }
    return dispatch(doSetLuzEstado(idSenal, luz, estado)).then(() => dispatch(clearAllPending()));
  });
}

export function doSetLuzEstado(idSenal, luz, estado) {
  return (dispatch, getState, database) =>
    dispatch(setPending(idSenal, luz))
      .then(() => database.ref(`senales/${idSenal}/${luz}/estado`).set(estado))
      .then(() => dispatch(setEnclavamientos(idSenal, estado)));
}

export function setLuzManual(idSenal, luz, manual) {
  return (dispatch, getState, database) =>
    database.ref(`senales/${idSenal}/${luz}/manual`).set(manual);
}
