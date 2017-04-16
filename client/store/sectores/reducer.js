import update from 'immutability-helper';

import {
  REPLY_RECEIVED,
} from '_store/requests/constants';

import {
  GET_SECTOR,
  LIST_SECTORES,
} from './constants';


const assign = (...args) => Object.assign({}, ...args);

export default (
  state = {},
  action
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case LIST_SECTORES:
      return assign(state,
        payload,
        { $loaded: true },
      );
    case GET_SECTOR:
      return update(state,
        { $merge: assign(
          payload.entities.sectores,
          { $loaded: true }
        ) }
      );
    default:
      return state;
  }
};
