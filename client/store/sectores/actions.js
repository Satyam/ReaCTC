import restAPI from '_platform/restAPI';
import { normalize, schema } from 'normalizr';

import { NAME, GET_SECTOR, GET_SECTORES } from './constants';

import { selSectorRequested, selSectoresLoaded } from './selectors';

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
    if (selSectorRequested(getState(), idSector)) {
      return Promise.resolve();
    }
    return dispatch({
      type: GET_SECTOR,
      promise: api.read(idSector).then(response => normalize(response, sector)),
      payload: {
        idSector,
      },
    });
  };
}

export function getSectores() {
  return (dispatch, getState) => {
    if (selSectoresLoaded(getState())) {
      return Promise.resolve();
    }
    return dispatch({
      type: GET_SECTORES,
      promise: api.read(),
    });
  };
}
