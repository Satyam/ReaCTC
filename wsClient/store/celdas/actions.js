import map from 'lodash/map';

import { selCelda, selEnclavamientos, selIsPending, selSenalIsManual } from '_store/selectors';

import { clearAllPending, setPending, setLuzEstado } from '_store/actions';

import { SET_CAMBIO, SET_CAMBIO_MANUAL } from '_store/constants';

export { clickCelda } from '_webClient/store/celdas/actions';

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
                setCambio(enclavamiento.celda, enclavamiento[celda.posicion])
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
                      : dispatch(setLuzEstado(idSenal, luz, estado))
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

export function setCambio(idCelda, posicion) {
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
          wsMode: 'all',
        })
      )
      .then(() => dispatch(setEnclavamientos(idCelda)))
      .then(() => dispatch(clearAllPending()));
  };
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
