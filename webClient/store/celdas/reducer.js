// @flow
import indexBy from '_utils/indexBy';

import { REPLY_RECEIVED } from '_utils/promiseMiddleware';

import { GET_SECTOR } from '_store/constants';

import { SET_CAMBIO, SET_CAMBIO_MANUAL } from './constants';
import type { CeldasReducer } from './flowtypes';

const reducer: CeldasReducer = (state = {}, action) => {
  if (action && action.stage && action.stage !== REPLY_RECEIVED) return state;
  switch (action.type) {
    case GET_SECTOR: {
      return {
        ...state,
        ...indexBy(action.payload.celdas, 'idCelda'),
      };
    }
    case SET_CAMBIO: {
      const { idCelda, posicion } = action.payload;
      return {
        ...state,
        [idCelda]: {
          ...state[idCelda],
          posicion,
        },
      };
    }
    case SET_CAMBIO_MANUAL: {
      const { idCelda, manual } = action.payload;
      return {
        ...state,
        [idCelda]: {
          ...state[idCelda],
          manual,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
