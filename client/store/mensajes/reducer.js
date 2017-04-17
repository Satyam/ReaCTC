import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { ADD_MENSAJE } from './constants';

export default (state = [], action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case ADD_MENSAJE:
      return update(state, { $push: payload });
    default:
      return state;
  }
};
