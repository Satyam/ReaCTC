// @flow
import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from '_utils/promiseMiddleware';

export type ActionBase = {
  +type: string,
  payload?: {},
  meta?: any,
};

export type AsyncActionRequested = ActionBase & {
  stage: REQUEST_SENT,
};

export type AsyncActionReplied = ActionBase & {
  stage: REPLY_RECEIVED,
};

export type AsyncActionFailed = ActionBase & {
  stage: FAILURE_RECEIVED,
  error: string,
};

export type PromiseAction = ActionBase & {
  promise: Promise<any>,
};
