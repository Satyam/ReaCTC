// @flow
import { combineReducers } from 'redux';
import {
  REPLY_RECEIVED,
  REQUEST_SENT,
  FAILURE_RECEIVED,
} from '_utils/promiseMiddleware';
import indexBy from '_utils/indexBy';

import {
  GET_SECTOR,
  LIST_SECTORES,
  ADD_STATUS_ADMIN,
  CLEAR_STATUS_ADMIN,
} from './constants';
import type {
  AdminStatusReducer,
  SectoresListReducer,
  SectoresHashReducer,
} from './flowtypes';

export const adminStatus: AdminStatusReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_STATUS_ADMIN:
      return [...state, action.payload];
    case CLEAR_STATUS_ADMIN:
      return [];
    default:
      return state;
  }
};

export const list: SectoresListReducer = (
  state = { list: [], requested: false },
  action,
) => {
  switch (action.type) {
    case LIST_SECTORES:
      switch (action.stage) {
        case REQUEST_SENT:
          return {
            ...state,
            requested: true,
          };
        case REPLY_RECEIVED:
          return {
            ...state,
            list: action.payload.list,
            requested: false,
          };
        case FAILURE_RECEIVED:
          return {
            ...state,
            requested: false,
          };
        default:
          return state;
      }
    default:
      return state;
  }
};

export const hash: SectoresHashReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SECTOR:
      switch (action.stage) {
        case REQUEST_SENT:
        case FAILURE_RECEIVED:
          // See selSectorRequested in ./selectors
          return {
            ...state,
            [action.payload.idSector]: null,
          };
        case REPLY_RECEIVED:
          return {
            ...state,
            ...indexBy([action.payload.sectores], 'idSector'),
          };
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
