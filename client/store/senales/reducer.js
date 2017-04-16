import update from 'immutability-helper';

import {
  REPLY_RECEIVED,
} from '_store/requests/constants';

import {
  GET_SECTOR,
} from '_store/sectores/constants';

export default (
  state = {},
  action
) => {
  const payload = action.payload;
  switch (action.stage) {
    case REPLY_RECEIVED:
      switch (action.type) {
        case GET_SECTOR:
          return update(state,
            { $merge: payload.entities.senales }
          );
        default:
          return state;
      }
    default:
      return state;
  }
};
