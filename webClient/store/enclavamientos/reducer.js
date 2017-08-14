import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/constants';
import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

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
      const enclavamientos = payload.entities.enclavamientos;
      return enclavamientos
        ? update(state, {
          hash: { $merge: enclavamientos },
        })
        : state;
    }
    case SET_PENDING:
      return update(state, { pending: { $push: [payload.idCelda] } });
    case CLEAR_ALL_PENDING:
      return update(state, { pending: { $set: [] } });
    default:
      return state;
  }
};
