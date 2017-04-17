import asyncActionCreator from '_utils/asyncActionCreator';
import restAPI from '_platform/restAPI';
import { normalize, schema } from 'normalizr';
import update from 'immutability-helper';

import { NAME, GET_SECTOR, LIST_SECTORES } from './constants';

import { selSectorLoaded, selSectoresLoaded } from './selectors';

const senal = new schema.Entity(
  'senales',
  {},
  { idAttribute: (value, parent) => `${parent.sector}:${parent.coords}:${value.dir}` }
);
const celda = new schema.Entity(
  'celdas',
  { senales: [senal] },
  {
    idAttribute: (value, parent) => `${parent.sector}:${value.coords}`,
    processStrategy: (value, parent) => Object.assign(value, { sector: parent.sector }),
  }
);
let enc = 0;
const enclavamiento = new schema.Entity(
  'enclavamientos',
  {},
  {
    idAttribute: (value, parent) => `${parent.sector}:${value.id}`,
    processStrategy: value => Object.assign(value, { id: enc++ }), //eslint-disable-line no-plusplus
  }
);

const sector = new schema.Entity(
  'sectores',
  {
    celdas: [celda],
    enclavamientos: [enclavamiento],
  },
  { idAttribute: 'idSector' }
);

const api = restAPI(NAME);

export function getSector(idSector) {
  return (dispatch, getState) => {
    if (selSectorLoaded(getState())) {
      return Promise.resolve();
    }
    return dispatch(
      asyncActionCreator(GET_SECTOR, api.read(idSector), { idSector })
    ).then(response =>
      update(response, {
        payload: {
          $set: normalize(response.payload, sector),
        },
      })
    );
  };
}

export function getSectores() {
  return (dispatch, getState) => {
    if (selSectoresLoaded(getState())) {
      return Promise.resolve();
    }
    return dispatch(asyncActionCreator(LIST_SECTORES, api.read()));
  };
}
