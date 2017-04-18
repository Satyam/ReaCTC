import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { GET_SECTOR } from '_store/sectores/constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      const celdas = payload.entities.celdas;
      return celdas ? update(state, { $merge: celdas }) : state;
    }
    default:
      return state;
  }
};
