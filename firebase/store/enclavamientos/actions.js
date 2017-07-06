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
  return (dispatch, getState, firebase) => {
    const database = firebase.database();
    return database
      .ref(`celdas/${idCelda}/enclavamientos`)
      .once('value')
      .then(idEnclvSnapshot => idEnclvSnapshot && idEnclvSnapshot.val())
      .then(
        enclavamientos =>
          enclavamientos &&
          Promise.all(
            enclavamientos.map(idEnclavamiento =>
              database
                .ref(`enclavamientos/${idEnclavamiento}`)
                .once('value')
                .then(enclvSnapshot => enclvSnapshot.val())
                .then((enclavamiento) => {
                  switch (enclavamiento.tipo) {
                    case 'apareados':
                      const otherIdCelda = enclavamiento.celda;
                      return database
                        .ref(`celdas/${otherIdCelda}/manual`)
                        .once('value')
                        .then(snapshot => snapshot.val())
                        .then((manual) => {
                          console.log('manual', otherIdCelda, enclavamiento[extra], manual);
                          return (
                            !manual && dispatch(doSetCambio(otherIdCelda, enclavamiento[extra]))
                          );
                        });
                    case 'senalCambio': {
                      const luces = enclavamiento[extra];
                      const idSenal = enclavamiento.senal;
                      return Promise.all(
                        map(luces, (estado, luz) =>
                          database
                            .ref(`senales/${idSenal}/${luz}/manual`)
                            .once('value')
                            .then(snapshot => snapshot.val())
                            .then(
                              manual => !manual && dispatch(doSetLuzEstado(idSenal, luz, estado))
                            )
                        )
                      );
                    }
                    default:
                      return Promise.reject(
                        `Celda ${idCelda} tiene enclavamiento desconocido ${enclavamiento.tipo}`
                      );
                  }
                })
            )
          )
      );
  };
}
