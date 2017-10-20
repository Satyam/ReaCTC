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
} from './flowtypes';

const api = restAPI(NAME);

export function getSector(idSector: IdType): AsyncActionCreator<GetSectorAction | void> {
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

export function listSectores(): AsyncActionCreator<ListSectoresAction | void> {
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

export function deleteSectores(idSectores: IdType[]): AsyncActionCreator<ListSectoresAction> {
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

function fileRead(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => resolve(ev.currentTarget.result);
    reader.onerror = ev => reject(new Error(`Error ${ev.toString()} reading file ${file.name}`));
    reader.readAsText(file);
  });
}

function doAddSector(name: string, sectorConfig: SectorType) {
  return async (dispatch) => {
    await dispatch({
      type: ADD_SECTOR,
      promise: async () => {
        try {
          await api.create('/', sectorConfig);
        } catch (err) {
          if (err.code === 409) {
            await dispatch(
              addStatusAdmin(
                'warn',
                name,
                `{idSector: ${String(
                  sectorConfig.idSector
                )}} duplicado en ${sectorConfig.descrCorta}`
              )
            );
          }
          throw new Error(err);
        }
      },
    });
  };
}

export function addSector(file: File): AsyncActionCreator<ListSectoresAction> {
  return async (dispatch) => {
    const content = await fileRead(file);
    let sectorConfig: SectorType;
    try {
      sectorConfig = JSON.parse(content);
    } catch (err) {
      await dispatch(addStatusAdmin('error', file.name, `archivo no contiene JSON válido ${err}`));
      throw new Error(`archivo ${file.name} no contiene JSON válido ${err}`);
    }
    // this split of the conditions to check sectorConfig is for the sake of flow
    // that needs to statically ensure sectorConfig is an object before checking
    // its properties
    if (sectorConfig && typeof sectorConfig === 'object') {
      if (
        typeof sectorConfig.idSector === 'string' &&
        identifier.test(sectorConfig.idSector) &&
        typeof sectorConfig.descr === 'string' &&
        typeof sectorConfig.descrCorta === 'string' &&
        typeof sectorConfig.alto === 'number' &&
        sectorConfig.alto >= 1 &&
        typeof sectorConfig.ancho === 'number' &&
        sectorConfig.ancho >= 1 &&
        Array.isArray(sectorConfig.celdas) &&
        sectorConfig.celdas.length >= 1
      ) {
        await dispatch(doAddSector(file.name, sectorConfig));
        await dispatch(addStatusAdmin('normal', file.name, `Agregado ${sectorConfig.descrCorta}`));
      } else {
        await dispatch(addStatusAdmin('error', file.name, 'faltan campos obligatorios'));
      }
    } else {
      await dispatch(addStatusAdmin('error', file.name, 'configuración inválida o vacía'));
    }
    await dispatch(listSectores());
  };
}
