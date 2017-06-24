import update from 'immutability-helper';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/sectores/constants';
import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export function indexEnclavamientos(idSector, enclavamientos = []) {
  const hash = {};
  function addCelda(coords, obj) {
    const key = `${idSector}:${coords}`;
    const entry = hash[key];
    if (entry) {
      entry.push(obj);
    } else {
      hash[key] = [obj];
    }
  }
  enclavamientos.forEach((enclavamiento) => {
    switch (enclavamiento.tipo) {
      case 'apareados': {
        const celdas = enclavamiento.celdas;
        celdas.forEach((coords, index) => {
          addCelda(
            coords,
            Object.assign({}, enclavamiento, {
              celdas: celdas.slice(0, index).concat(celdas.slice(index + 1)),
            })
          );
        });
        break;
      }
      case 'senalCambio':
      case 'senalTriple':
        addCelda(enclavamiento.celda, enclavamiento);
        break;
      default:
    }
  });

  return hash;
}

export default (
  state = {
    hash: {},
    pending: [],
  },
  action
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      return update(state, {
        hash: { $merge: mapValues(payload.entities.enclavamientos, o => values(o)) },
      });
    }
    case SET_PENDING:
      return update(state, { pending: { $push: [`${payload.idSector}:${payload.coords}`] } });
    case CLEAR_ALL_PENDING:
      return update(state, { pending: { $set: [] } });
    default:
      return state;
  }
};
