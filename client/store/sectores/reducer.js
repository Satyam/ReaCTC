import update from 'immutability-helper';

import { REPLY_RECEIVED, REQUEST_SENT } from '_store/promiseMiddleware';

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
  const payload = action.payload;
  if (action.type === GET_SECTOR && action.stage === REQUEST_SENT) {
    return update(state, { hash: { [payload.idSector]: { $set: {} } } });
  }
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
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
