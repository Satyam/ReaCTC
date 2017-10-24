import indexBy from '_utils/indexBy';
import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/constants';
import { SET_PENDING, CLEAR_ALL_PENDING } from './constants';

export default (
  state = {
    hash: {},
    pending: [],
  },
  action,
) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  switch (action.type) {
    case GET_SECTOR: {
      const { enclavamientos } = action.payload;
      if (!enclavamientos) return state;
      return {
        ...state,
        hash: {
          ...state.hash,
          ...indexBy(enclavamientos, 'idEnclavamiento'),
        },
      };
    }
    case SET_PENDING: {
      const { idCelda } = action.payload;
      return {
        ...state,
        pending: [...state.pending, idCelda],
      };
    }
    case CLEAR_ALL_PENDING:
      return {
        ...state,
        pending: [],
      };
    default:
      return state;
  }
};
