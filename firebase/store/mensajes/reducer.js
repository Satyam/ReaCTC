import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { ADD_MENSAJE } from './constants';

export default (state = [], action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case ADD_MENSAJE:
      return [...state, ...payload];
    default:
      return state;
  }
};
