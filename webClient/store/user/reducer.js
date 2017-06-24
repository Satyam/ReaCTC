// import update from 'immutability-helper';
import pick from 'lodash/pick';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { LOGIN, SIGNUP, LOGOUT, GET_DATA } from './constants';

// const assign = (...args) => Object.assign({}, ...args);

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case LOGIN:
    case SIGNUP:
      if (payload.success) {
        return pick(payload, 'username');
      }
      return state;
    case GET_DATA:
      return pick(payload, 'username');
    case LOGOUT:
      return {};
    default:
      return state;
  }
};
