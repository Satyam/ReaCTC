import map from 'lodash/map';

import { selCelda, selEnclavamientos, selIsPending, selSenalIsManual } from '_store/selectors';

import { clearAllPending, setPending, setLuzEstado } from '_store/actions';

import { CLICK_CELDA, SET_CAMBIO, SET_TRIPLE, SET_CAMBIO_MANUAL } from './constants';

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

export function setCambio(idSector, coords, desviado) {
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idSector, coords);
    if (celda.tipo !== 'cambio') {
      return Promise.reject(`Celda en ${coords} de ${idSector} no es un cambio`);
    }
    if (celda.desviado === desviado) {
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
            desviado,
          },
        })
      )
      .then(
        () =>
          (celda.manual
            ? Promise.resolve()
            : Promise.all(
                selEnclavamientos(getState(), idSector, coords).map((enclavamiento) => {
                  switch (enclavamiento.tipo) {
                    case 'apareados':
                      return dispatch(setCambio(idSector, enclavamiento.celda, desviado));
                    case 'senalCambio': {
                      const caso = desviado ? enclavamiento.desviado : enclavamiento.normal;
                      const [c, dir] = enclavamiento.senal.split(':');
                      return Promise.all(
                        map(
                          caso,
                          (estado, luz) =>
                            (selSenalIsManual(getState(), idSector, c, dir, luz)
                              ? Promise.resolve()
                              : dispatch(setLuzEstado(idSector, c, dir, luz, estado)))
                        )
                      );
                    }
                    default:
                      return Promise.reject(
                        `Celda en ${coords} de ${idSector} tiene enclavamiento desconocido ${enclavamiento.tipo}`
                      );
                  }
                })
              ))
      )
      .then(() => dispatch(clearAllPending()));
  };
}

export function setTriple(idSector, coords, posicion) {
  return (dispatch, getState) => {
    const celda = selCelda(getState(), idSector, coords);
    if (celda.tipo !== 'triple') {
      return Promise.reject(`Celda en ${coords} de ${idSector} no es un cambio triple`);
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
          type: SET_TRIPLE,
          payload: {
            idSector,
            coords,
            posicion,
          },
        })
      )
      .then(
        () =>
          (celda.manual
            ? Promise.resolve()
            : Promise.all(
                selEnclavamientos(getState(), idSector, coords).map((enclavamiento) => {
                  switch (enclavamiento.tipo) {
                    case 'apareados':
                      return Promise.alldispatch(
                        setCambio(idSector, enclavamiento.celda, posicion)
                      );
                    case 'senalTriple': {
                      const caso = enclavamiento[['izq', 'centro', 'der'][posicion + 1]];
                      const [c, dir] = enclavamiento.senal.split(':');
                      return Promise.all(
                        map(
                          caso,
                          (estado, luz) =>
                            (selSenalIsManual(getState(), idSector, c, dir, luz)
                              ? Promise.resolve()
                              : dispatch(setLuzEstado(idSector, c, dir, luz, estado)))
                        )
                      );
                    }
                    default:
                      return Promise.reject(
                        `Celda en ${coords} de ${idSector} tiene enclavamiento desconocido ${enclavamiento.tipo}`
                      );
                  }
                })
              ))
      )
      .then(() => dispatch(clearAllPending()));
  };
}

export function setCambioManual(idSector, coords, manual) {
  return {
    type: SET_CAMBIO_MANUAL,
    payload: {
      idSector,
      coords,
      manual,
    },
  };
}
