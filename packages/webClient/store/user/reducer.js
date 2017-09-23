// import update from 'immutability-helper';
import pick from 'lodash/pick';

import { REPLY_RECEIVED, REQUEST_SENT } from 'redux-middleware';

import { LOGIN, SIGNUP, LOGOUT, GET_DATA } from './constants';

// const assign = (...args) => Object.assign({}, ...args);

export default (state = {}, action) => {
  switch (action.stage) {
    case REQUEST_SENT:
      return action.type === LOGOUT ? {} : state;
    case REPLY_RECEIVED: {
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
    }
    default:
      return state;
  }
};
