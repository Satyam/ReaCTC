import map from 'lodash/map';

import { doSetCambio, doSetLuzEstado } from '_store/actions';

import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export function setPending(...payload) {
  return dispatch =>
    Promise.resolve(
      dispatch({
        type: SET_PENDING,
        payload,
      })
    );
}

export function clearAllPending() {
  return { type: CLEAR_ALL_PENDING };
}

export function setEnclavamientos(idCelda, extra) {
  return async (dispatch, getState, database) => {
    const idEnclvSnapshot = await database.ref(`celdas/${idCelda}/enclavamientos`).once('value');
    const enclavamientos = idEnclvSnapshot ? idEnclvSnapshot.val() : [];
    Promise.all(
      enclavamientos.map(async (idEnclavamiento) => {
        const enclvSnapshot = await database.ref(`enclavamientos/${idEnclavamiento}`).once('value');
        const enclavamiento = enclvSnapshot.val();
        switch (enclavamiento.tipo) {
          case 'apareados': {
            const otherIdCelda = enclavamiento.celda;
            const snapshot = await database.ref(`celdas/${otherIdCelda}/manual`).once('value');
            const manual = snapshot.val();
            if (!manual) {
              await dispatch(doSetCambio(otherIdCelda, enclavamiento[extra]));
            }
            break;
          }
          case 'senalCambio': {
            const luces = enclavamiento[extra];
            const idSenal = enclavamiento.senal;
            await Promise.all(
              map(luces, async (estado, luz) => {
                const snapshot = await database
                  .ref(`senales/${idSenal}/${luz}/manual`)
                  .once('value');
                const manual = snapshot.val();
                if (!manual) {
                  await dispatch(doSetLuzEstado(idSenal, luz, estado));
                }
              })
            );
            break;
          }
          default:
            throw new Error(
              `Celda ${idCelda} tiene enclavamiento desconocido ${enclavamiento.tipo}`
            );
        }
      })
    );
  };
}
