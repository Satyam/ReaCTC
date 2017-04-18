import update from 'immutability-helper';

import { REPLY_RECEIVED } from '_store/requests/constants';

import { GET_SECTOR } from '_store/sectores/constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  const payload = action.payload;
  switch (action.type) {
    case GET_SECTOR: {
      const senales = payload.entities.senales;
      return senales ? update(state, { $merge: senales }) : state;
    }
    default:
      return state;
  }
};
