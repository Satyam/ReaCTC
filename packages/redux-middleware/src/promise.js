// @flow
import omit from 'lodash/omit';

import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from './constants';

type Action = {
  +type: string,
};

type PromiseAction = {
  +type: string,
  promise: ?Promise<any>,
};

type Next = (action: Action) => any;
export default function promiseMiddleware() {
  return (next: Next) => (action: PromiseAction) => {
    if (action.promise && typeof action.promise.then === 'function') {
      const promise = action.promise;
      const act = omit(action, 'promise');
      next({
        ...act,
        stage: REQUEST_SENT,
      });
      return promise.then(
        response =>
          next({
            ...act,
            stage: REPLY_RECEIVED,
            payload: Object.assign(
              {},
              act.payload,
              Array.isArray(response) ? { list: response } : response
            ),
          }),
        error =>
          next({
            ...act,
            stage: FAILURE_RECEIVED,
            error: error.toString(),
          })
      );
    }
    return next(action);
  };
}
