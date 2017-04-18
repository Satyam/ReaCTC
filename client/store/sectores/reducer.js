import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { GET_SECTOR, GET_SECTORES } from './constants';

const assign = (...args) => Object.assign({}, ...args);

export default (
  state = {
    list: [],
    hash: {},
    $loaded: false,
  },
  action
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTORES:
      return assign(state, payload, { $loaded: true });
    case GET_SECTOR:
      return update(state, {
        hash: {
          $merge: payload.entities.sectores,
        },
      });
    default:
      return state;
  }
};
