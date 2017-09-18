import map from 'lodash/map';

import { selCelda, selEnclavamientos, selSenalIsManual } from '_store/selectors';

import { doSetCambio, doSetLuzEstado } from '_store/actions';

import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export function setPending(idCelda) {
  return {
    type: SET_PENDING,
    payload: {
      idCelda,
    },
  };
}

export function clearAllPending() {
  return { type: CLEAR_ALL_PENDING };
}

export function setEnclavamientos(idCelda) {
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idCelda);
    return celda.manual
      ? Promise.resolve()
      : Promise.all(
        celda.enclavamientos.map((idEnclavamiento) => {
          const enclavamiento = selEnclavamientos(getState(), idEnclavamiento);
          switch (enclavamiento.tipo) {
            case 'apareados':
              return dispatch(
                /* eslint-disable no-use-before-define */
                doSetCambio(enclavamiento.celda, enclavamiento[celda.posicion])
                /* eslint-enable no-use-before-define */
              );
            case 'senalCambio': {
              const caso = enclavamiento[celda.posicion];
              const idSenal = enclavamiento.senal;
              return Promise.all(
                map(
                  caso,
                  // prettier-ignore
                  (estado, luz) => (
                    selSenalIsManual(getState(), idSenal, luz)
                      ? Promise.resolve()
                      : dispatch(doSetLuzEstado(idSenal, luz, estado))
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
      );
  };
}
