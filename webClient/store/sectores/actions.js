// @flow
import restAPI from '_utils/restAPI';
import type { AsyncActionCreator } from '_store/flowtypes';

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
import type {
  GetSectorAction,
  ListSectoresAction,
  AddStatusAdminAction,
  ClearStatusAdminAction,
  DeleteSectoresAction,
  AddSectorAction,
} from './flowtypes';

const api = restAPI(NAME);

export function getSector(idSector: IdType): AsyncActionCreator<GetSectorAction> {
  return async (dispatch, getState) => {
    if (selSectorRequested(getState(), idSector)) {
      return;
    }
    await dispatch({
      type: GET_SECTOR,
      promise: BUNDLE === 'webClient' && api.read(idSector),
      wsMode: BUNDLE === 'wsClient' && 'me',
      payload: {
        idSector,
      },
    });
  };
}

export function listSectores(): AsyncActionCreator<ListSectoresAction> {
  return async (dispatch, getState) => {
    if (selSectoresRequested(getState())) {
      return;
    }
    await dispatch({
      type: LIST_SECTORES,
      promise: BUNDLE === 'webClient' && api.read(),
      wsMode: BUNDLE === 'wsClient' && 'me',
    });
  };
}

export function addStatusAdmin(
  nivel: AdminStatusNivel,
  entity: string,
  message: string
): AddStatusAdminAction {
  return {
    type: ADD_STATUS_ADMIN,
    payload: {
      nivel,
      entity,
      message,
    },
  };
}

export function clearStatusAdmin(): ClearStatusAdminAction {
  return {
    type: CLEAR_STATUS_ADMIN,
  };
}

export function deleteSectores(idSectores: IdType[]): AsyncActionCreator<DeleteSectoresAction> {
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

export function addSector(file: File): AsyncActionCreator<AddSectorAction> {
  return dispatch =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (ev) => {
        let sCfg: ?SectorType;
        try {
          sCfg = JSON.parse(ev.currentTarget.result);
        } catch (err) {
          await dispatch(
            addStatusAdmin('error', file.name, `archivo no contiene JSON válido ${err}`)
          );
          reject(`archivo ${file.name} no contiene JSON válido ${err}`);
        }
        // this split of the conditions to check sCfg is for the sake of flow
        // that needs to statically ensure sCfg is an object before checking
        // its properties
        if (sCfg && typeof sCfg === 'object') {
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
                  await dispatch(
                    addStatusAdmin('normal', file.name, `Agregado ${sCfg.descrCorta}`)
                  );
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
