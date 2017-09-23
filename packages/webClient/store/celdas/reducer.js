import update from 'immutability-helper';
import { indexBy } from 'ctc-utils';

import { REPLY_RECEIVED } from 'redux-middleware';

import { GET_SECTOR } from '_store/constants';
import { SET_CAMBIO, SET_CAMBIO_MANUAL } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      return update(state, { $merge: indexBy(payload.celdas, 'idCelda') });
    }
    case SET_CAMBIO:
      return update(state, {
        [payload.idCelda]: { posicion: { $set: payload.posicion } },
      });
    case SET_CAMBIO_MANUAL:
      return update(state, {
        [payload.idCelda]: { manual: { $set: payload.manual } },
      });
    default:
      return state;
  }
};
