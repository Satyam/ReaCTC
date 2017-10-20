// @flow
import update from 'immutability-helper';
import { combineReducers } from 'redux';
import { REPLY_RECEIVED, REQUEST_SENT, FAILURE_RECEIVED } from '_utils/promiseMiddleware';
import indexBy from '_utils/indexBy';

import { GET_SECTOR, LIST_SECTORES, ADD_STATUS_ADMIN, CLEAR_STATUS_ADMIN } from './constants';
import type { AdminStatusReducer, SectoresListReducer, SectoresHashReducer } from './flowtypes';

export const adminStatus: AdminStatusReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_STATUS_ADMIN:
      return update(state, { $push: [action.payload] });
    case CLEAR_STATUS_ADMIN:
      return update(state, { $set: [] });
    default:
      return state;
  }
};

export const list: SectoresListReducer = (state = { list: [], requested: false }, action) => {
  switch (action.type) {
    case LIST_SECTORES:
      switch (action.stage) {
        case REQUEST_SENT:
          return update(state, { requested: { $set: true } });
        case REPLY_RECEIVED:
          return update(state, { list: { $set: action.payload.list }, requested: { $set: false } });
        case FAILURE_RECEIVED:
          return update(state, { requested: { $set: false } });
        default:
          return state;
      }
    default:
      return state;
  }
};

export const hash: SectoresHashReducer = (state = {}, action) => {
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR:
      switch (action.stage) {
        case REQUEST_SENT:
        case FAILURE_RECEIVED:
          // See selSectorRequested in ./selectors
          return update(state, { [payload.idSector]: { $set: null } });
        case REPLY_RECEIVED:
          return update(state, { $merge: indexBy([payload.sectores], 'idSector') });
        default:
          return state;
      }
    default:
      return state;
  }
};
export default combineReducers({
  list,
  hash,
  adminStatus,
});
