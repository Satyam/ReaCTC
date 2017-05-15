import asyncActionCreator from '_utils/asyncActionCreator';
import restAPI from '_platform/restAPI';
import { normalize, schema } from 'normalizr';

import { NAME, GET_SECTOR, GET_SECTORES } from './constants';

import { selSectorLoaded, selSectoresLoaded } from './selectors';

const senal = new schema.Entity(
  'senales',
  {},
  { idAttribute: (value, parent) => `${parent.idSector}:${parent.coords}:${value.dir}` }
);
const enclavamiento = new schema.Entity(
  'enclavamientos',
  {},
  { idAttribute: (value, parent) => `${parent.idSector}:${parent.coords}` }
);
const celda = new schema.Entity(
  'celdas',
  {
    senales: [senal],
    enclavamientos: enclavamiento,
  },
  {
    idAttribute: (value, parent) => `${parent.idSector}:${value.coords}`,
    processStrategy: (value, parent) => Object.assign(value, { idSector: parent.idSector }),
  }
);

const sector = new schema.Entity(
  'sectores',
  {
    celdas: [celda],
  },
  { idAttribute: 'idSector' }
);

const api = restAPI(NAME);

export function getSector(idSector) {
  return (dispatch, getState) => {
    if (selSectorLoaded(getState(), idSector)) {
      return Promise.resolve();
    }
    return dispatch(
      asyncActionCreator(
        GET_SECTOR,
        api.read(idSector).then(response => normalize(response, sector)),
        { idSector }
      )
    );
  };
}

export function getSectores() {
  return (dispatch, getState) => {
    if (selSectoresLoaded(getState())) {
      return Promise.resolve();
    }
    return dispatch(asyncActionCreator(GET_SECTORES, api.read()));
  };
}
