import {
  REQUEST_SENT,
  REPLY_RECEIVED,
  FAILURE_RECEIVED,
} from '_utils/promiseMiddleware';

import { CLEAR_HTTP_ERRORS } from './constants';

export default (state = { pending: 0, errors: [] }, action) => {
  switch (action.type) {
    case CLEAR_HTTP_ERRORS:
      return {
        ...state,
        errors: [],
      };
    default:
      switch (action.stage) {
        case REQUEST_SENT:
          return {
            ...state,
            pending: state.pending + 1,
          };
        case REPLY_RECEIVED: {
          const pending = state.pending;
          return {
            ...state,
            pending: pending > 0 ? pending - 1 : 0,
          };
        }
        case FAILURE_RECEIVED: {
          const { pending, errors } = state;
          return {
            ...state,
            pending: pending > 0 ? pending - 1 : 0,
            errors: [...errors, action],
          };
        }
        default:
          return state;
      }
  }
};
