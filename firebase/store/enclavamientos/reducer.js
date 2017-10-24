import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export default (
  state = {
    pending: [],
  },
  action,
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  switch (action.type) {
    case SET_PENDING:
      return {
        ...state,
        pending: [...state.pending, action.payload.join('|')],
      };
    case CLEAR_ALL_PENDING:
      return {
        ...state,
        pending: [],
      };
    default:
      return state;
  }
};
