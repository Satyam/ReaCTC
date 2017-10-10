import restAPI from '_utils/restAPI';

import {
  NAME,
  GET_SECTOR,
  LIST_SECTORES,
  DELETE_SECTOR,
  ADD_SECTOR,
  ADD_STATUS_ADMIN,
  CLEAR_STATUS_ADMIN,
} from './constants';

import { selSectorRequested, selSectoresRequested } from './selectors';

const api = restAPI(NAME);

export function getSector(idSector) {
  return (dispatch, getState) => {
    if (selSectorRequested(getState(), idSector)) {
      return Promise.resolve();
    }
    return dispatch({
      type: GET_SECTOR,
      promise: BUNDLE === 'webClient' && api.read(idSector),
      wsMode: BUNDLE === 'wsClient' && 'me',
      payload: {
        idSector,
      },
    });
  };
}

export function listSectores() {
  return (dispatch, getState) => {
    if (selSectoresRequested(getState())) {
      return Promise.resolve();
    }
    return dispatch({
      type: LIST_SECTORES,
      promise: BUNDLE === 'webClient' && api.read(),
      wsMode: BUNDLE === 'wsClient' && 'me',
    });
  };
}

export function addStatusAdmin(nivel, entity, message) {
  return {
    type: ADD_STATUS_ADMIN,
    payload: {
      nivel,
      entity,
      message,
    },
  };
}

export function clearStatusAdmin() {
  return {
    type: CLEAR_STATUS_ADMIN,
  };
}

export function deleteSectores(idSectores) {
  return async (dispatch) => {
    await dispatch({
      type: DELETE_SECTOR,
      promise: api.delete(idSectores.join(',')),
      payload: {
        idSectores,
      },
    });
    await dispatch(addStatusAdmin('normal', idSectores.join(','), 'Borrados'));
    await dispatch(listSectores());
  };
}

const identifier = /^\w+$/;

export function addSector(file) {
  return dispatch =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (ev) => {
        let sCfg;
        try {
          sCfg = JSON.parse(ev.currentTarget.result);
        } catch (err) {
          await dispatch(
            addStatusAdmin('error', file.name, `archivo no contiene JSON válido ${err}`)
          );
          reject(`archivo ${file.name} no contiene JSON válido ${err}`);
        }
        if (
          typeof sCfg.idSector === 'string' &&
          identifier.test(sCfg.idSector) &&
          typeof sCfg.descr === 'string' &&
          typeof sCfg.descrCorta === 'string' &&
          typeof sCfg.alto === 'number' &&
          sCfg.alto >= 1 &&
          typeof sCfg.ancho === 'number' &&
          sCfg.ancho >= 1 &&
          Array.isArray(sCfg.celdas) &&
          sCfg.celdas.length >= 1
        ) {
          await dispatch({
            type: ADD_SECTOR,
            promise: async () => {
              try {
                await api.create('/', sCfg);
                await dispatch(addStatusAdmin('normal', file.name, `Agregado ${sCfg.descrCorta}`));
              } catch (err) {
                if (err.code === 409) {
                  await dispatch(
                    addStatusAdmin(
                      'warn',
                      file.name,
                      `{idSector: ${sCfg.idSector}} duplicado en ${sCfg.descrCorta}`
                    )
                  );
                }
                reject(err);
                throw new Error(err);
              }
            },
          });
          await dispatch(listSectores());
          resolve();
        }
        return dispatch(addStatusAdmin('error', file.name, 'faltan campos obligatorios'));
      };
      reader.onerror = async (ev) => {
        await dispatch(addStatusAdmin('error', file.name, ev.toString()));
        reject(ev);
      };

      reader.readAsText(file);
    });
}
