import update from 'immutability-helper';

import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from '_store/promiseMiddleware';

import { CLEAR_HTTP_ERRORS } from './constants';

export default (state = { pending: 0, errors: [] }, action) => {
  switch (action.type) {
    case CLEAR_HTTP_ERRORS:
      return update(state, { errors: { $set: [] } });
    default:
      switch (action.stage) {
        case REQUEST_SENT:
          return update(state, { pending: { $apply: x => x + 1 } });
        case REPLY_RECEIVED:
          return update(state, {
            pending: { $apply: x => (x > 0 ? x - 1 : 0) },
          });
        case FAILURE_RECEIVED:
          return update(state, {
            pending: { $apply: x => (x > 0 ? x - 1 : 0) },
            errors: { $push: [action] },
          });
        default:
          return state;
      }
  }
};
