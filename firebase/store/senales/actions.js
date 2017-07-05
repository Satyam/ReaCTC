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
  return (dispatch, getState, firebase) => {
    const database = firebase.database();
    return database.ref(`senales/${idSenal}/${luz}`).once('value').then((snapshot) => {
      const senal = snapshot.val();
      if (senal.estado === estado) {
        return Promise.resolve();
      }
      if (selIsPending(getState(), idSenal)) {
        return Promise.reject(`Senal ${idSenal}/${luz} error: loop por enclavamiento`);
      }
      return dispatch(doSetLuzEstado(idSenal, luz, estado)).then(() => dispatch(clearAllPending()));
    });
  };
}

export function doSetLuzEstado(idSenal, luz, estado) {
  return (dispatch, getState, firebase) =>
    dispatch(setPending(idSenal))
      .then(() => firebase.database().ref(`senales/${idSenal}/${luz}/estado`).set(estado))
      .then(() => dispatch(setEnclavamientos(idSenal, estado)));
}

export function setLuzManual(idSenal, luz, manual) {
  return (dispatch, getState, firebase) =>
    firebase.database().ref(`senales/${idSenal}/${luz}/manual`).set(manual);
}
