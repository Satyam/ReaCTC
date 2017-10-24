import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { CLICK_SENAL } from '_store/senales/constants';

import { CLICK_CELDA } from '_store/celdas/constants';

import { CLOSE_ESTADO } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  switch (action.type) {
    case CLOSE_ESTADO:
      return {
        ...state,
        tipo: null,
      };
    case CLICK_CELDA:
    case CLICK_SENAL:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
