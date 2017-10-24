import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { CLICK_SENAL, CLICK_CELDA } from '_store/constants';

import { CLOSE_ESTADO } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case CLOSE_ESTADO:
      return {
        ...state,
        tipo: null,
      };
    case CLICK_CELDA:
      return {
        ...state,
        ...payload,
      };
    case CLICK_SENAL:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
