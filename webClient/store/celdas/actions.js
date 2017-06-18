import map from 'lodash/map';

import { selCelda, selEnclavamientos, selIsPending, selSenalIsManual } from '_store/selectors';

import { clearAllPending, setPending, setLuzEstado } from '_store/actions';

import { CLICK_CELDA, SET_CAMBIO, SET_CAMBIO_MANUAL } from './constants';

export function clickCelda(idSector, coords, tipo) {
  return {
    type: CLICK_CELDA,
    payload: {
      idSector,
      coords,
      tipo,
    },
  };
}

export function setEnclavamientos(idSector, coords) {
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idSector, coords);
    return celda.manual
      ? Promise.resolve()
      : Promise.all(
        selEnclavamientos(getState(), idSector, coords).map((enclavamiento) => {
          switch (enclavamiento.tipo) {
            case 'apareados':
              return dispatch(
                /* eslint-disable no-use-before-define */
                setCambio(idSector, enclavamiento.celda, enclavamiento[celda.posicion])
                /* eslint-enable no-use-before-define */
              );
            case 'senalCambio': {
              const caso = enclavamiento[celda.posicion];
              const [c, dir] = enclavamiento.senal.split(':');
              return Promise.all(
                map(
                  caso,
                  // prettier-ignore
                  (estado, luz) => (
                    selSenalIsManual(getState(), idSector, c, dir, luz)
                      ? Promise.resolve()
                      : dispatch(setLuzEstado(idSector, c, dir, luz, estado))
                  )
                )
              );
            }
            default:
              return Promise.reject(
                `Celda en ${coords} de ${idSector} tiene enclavamiento desconocido ${enclavamiento.tipo}`
              );
          }
        })
      );
  };
}

export function setCambio(idSector, coords, posicion) {
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idSector, coords);
    if (celda.tipo !== 'cambio' && celda.tipo !== 'triple') {
      return Promise.reject(`Celda en ${coords} de ${idSector} no es un cambio`);
    }
    if (celda.posicion === posicion) {
      return Promise.resolve();
    }
    if (selIsPending(getState(), idSector, coords)) {
      return Promise.reject(`Celda en ${coords} de ${idSector} loop por enclavamiento`);
    }
    return Promise.resolve(dispatch(setPending(idSector, coords)))
      .then(() =>
        dispatch({
          type: SET_CAMBIO,
          payload: {
            idSector,
            coords,
            posicion,
          },
        })
      )
      .then(() => dispatch(setEnclavamientos(idSector, coords)))
      .then(() => dispatch(clearAllPending()));
  };
}

export function setCambioManual(idSector, coords, manual) {
  return dispatch =>
    Promise.resolve(
      dispatch({
        type: SET_CAMBIO_MANUAL,
        payload: {
          idSector,
          coords,
          manual,
        },
      })
    ).then(() => dispatch(setEnclavamientos(idSector, coords)));
}
