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
  return async (dispatch, getState) => {
    const celda = selCelda(getState(), idCelda);
    if (celda.manual) return;
    await Promise.all(
      celda.enclavamientos.map(async (idEnclavamiento) => {
        const enclavamiento = selEnclavamientos(getState(), idEnclavamiento);
        switch (enclavamiento.tipo) {
          case 'apareados':
            await dispatch(
              /* eslint-disable no-use-before-define */
              doSetCambio(enclavamiento.celda, enclavamiento[celda.posicion])
              /* eslint-enable no-use-before-define */
            );
            return;
          case 'senalCambio': {
            const caso = enclavamiento[celda.posicion];
            const idSenal = enclavamiento.senal;
            await Promise.all(
              map(
                caso,
                // prettier-ignore
                async (estado, luz) => {
                  if (selSenalIsManual(getState(), idSenal, luz)) return;
                  await dispatch(doSetLuzEstado(idSenal, luz, estado));
                }
              )
            );
            return;
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
