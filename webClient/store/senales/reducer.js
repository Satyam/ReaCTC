import indexBy from '_utils/indexBy';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/constants';
import { SET_ESTADO_LUZ, SET_LUZ_MANUAL } from './constants';

export default (state = {}, action) => {
  if (action.stage && action.stage !== REPLY_RECEIVED) return state;
  switch (action.type) {
    case GET_SECTOR: {
      const { senales } = action.payload;
      if (!senales) return state;
      return {
        ...state,
        ...indexBy(senales, 'idSenal'),
      };
    }
    case SET_ESTADO_LUZ: {
      const { idSenal, luz, estado } = action.payload;
      return {
        ...state,
        [idSenal]: {
          ...state[idSenal],
          [luz]: { estado },
        },
      };
    }
    case SET_LUZ_MANUAL: {
      const { idSenal, luz, manual } = action.payload;
      return {
        ...state,
        [idSenal]: {
          ...state[idSenal],
          [luz]: { manual },
        },
      };
    }
    default:
      return state;
  }
};
