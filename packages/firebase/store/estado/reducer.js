import update from 'immutability-helper';

import { REPLY_RECEIVED } from 'redux-middleware';

import { CLICK_SENAL } from '_store/senales/constants';

import { CLICK_CELDA } from '_store/celdas/constants';

import { CLOSE_ESTADO } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case CLOSE_ESTADO:
      return update(state, { tipo: { $set: null } });
    case CLICK_CELDA:
      return update(state, { $merge: payload });
    case CLICK_SENAL:
      return update(state, { $merge: payload });
    default:
      return state;
  }
};
