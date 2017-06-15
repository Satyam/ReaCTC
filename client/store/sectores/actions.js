import restAPI from '_platform/restAPI';
import { normalize, schema } from 'normalizr';

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

export function listSectores() {
  return (dispatch, getState) => {
    if (selSectoresRequested(getState())) {
      return Promise.resolve();
    }
    return dispatch({
      type: LIST_SECTORES,
      promise: api.read(),
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
  return dispatch =>
    dispatch({
      type: DELETE_SECTOR,
      promise: api.delete(idSectores.join(',')),
    })
      .then(() => dispatch(addStatusAdmin('normal', idSectores.join(','), 'Borrados')))
      .then(() => dispatch(listSectores()));
}

const identifier = /^\w+$/;

export function addSector(file) {
  return (dispatch) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      let sCfg;
      try {
        sCfg = JSON.parse(e.currentTarget.result);
      } catch (err) {
        return dispatch(
          addStatusAdmin('error', file.name, `archivo no contiene JSON válido ${err}`)
        );
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
        return dispatch({
          type: ADD_SECTOR,
          promise: api.create('/', sCfg).then(
            () => dispatch(addStatusAdmin('normal', file.name, `Agregado ${sCfg.descrCorta}`)),
            (err) => {
              if (err.code === 409) {
                return dispatch(
                  addStatusAdmin(
                    'warn',
                    file.name,
                    `{idSector: ${sCfg.idSector}} duplicado en ${sCfg.descrCorta}`
                  )
                );
              }
              return Promise.reject(err);
            }
          ),
        }).then(() => dispatch(listSectores()));
      }
      return dispatch(addStatusAdmin('error', file.name, 'faltan campos obligatorios'));
    };
    reader.onerror = e => dispatch(addStatusAdmin('error', file.name, e.toString()));

    reader.readAsText(file);
  };
}
