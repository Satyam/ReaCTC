// import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { LOGIN, SIGNUP, LOGOUT } from './constants';

// const assign = (...args) => Object.assign({}, ...args);

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  // const payload = action.payload;
  switch (action.type) {
    case LOGIN:
    case SIGNUP:
    case LOGOUT:
    default:
      return state;
  }
};