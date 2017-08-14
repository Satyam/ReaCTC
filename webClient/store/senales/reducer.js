import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/constants';
import { SET_ESTADO_LUZ, SET_LUZ_MANUAL } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      const senales = payload.entities.senales;
      return senales ? update(state, { $merge: senales }) : state;
    }
    case SET_ESTADO_LUZ:
      return update(state, {
        [payload.idSenal]: {
          [payload.luz]: { estado: { $set: payload.estado } },
        },
      });
    case SET_LUZ_MANUAL:
      return update(state, {
        [payload.idSenal]: {
          [payload.luz]: { manual: { $set: payload.manual } },
        },
      });
    default:
      return state;
  }
};
