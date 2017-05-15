import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { GET_SECTOR } from '_store/sectores/constants';
import { SET_CAMBIO, SET_TRIPLE, SET_CAMBIO_MANUAL } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      const celdas = payload.entities.celdas;
      return celdas ? update(state, { $merge: celdas }) : state;
    }
    case SET_CAMBIO:
      return update(state, {
        [`${payload.idSector}:${payload.coords}`]: {
          desviado: { $set: payload.desviado },
        },
      });
    case SET_TRIPLE:
      return update(state, {
        [`${payload.idSector}:${payload.coords}`]: { posicion: { $set: payload.posicion } },
      });
    case SET_CAMBIO_MANUAL:
      return update(state, {
        [`${payload.idSector}:${payload.coords}`]: { manual: { $set: payload.manual } },
      });
    default:
      return state;
  }
};
