import omit from 'lodash/omit';

export const REQUEST_SENT = 'Stage: request sent';
export const REPLY_RECEIVED = 'Stage: reply received';
export const FAILURE_RECEIVED = 'Stage: failure received';

export default function promiseMiddleware() {
  return next => (action) => {
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
            payload: {
              ...act.payload,
              ...response,
            },
          }),
        (error) => {
          next({
            ...act,
            stage: FAILURE_RECEIVED,
            error: error.toString(),
          });
        }
      );
    }
    return next(action);
  };
}
