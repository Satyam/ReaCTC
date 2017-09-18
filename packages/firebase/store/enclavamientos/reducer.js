import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export default (
  state = {
    pending: [],
  },
  action
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case SET_PENDING:
      return update(state, { pending: { $push: [payload.join('|')] } });
    case CLEAR_ALL_PENDING:
      return update(state, { pending: { $set: [] } });
    default:
      return state;
  }
};
