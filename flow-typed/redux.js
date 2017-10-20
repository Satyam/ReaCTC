// @flow
declare type stageRequestSent = 'Stage: request sent';
declare type stageReplyReceived = 'Stage: reply received';
declare type stageFailureReceived = 'Stage: failure received';

declare type PromiseAction<T> = {
    +type: T,
    promise: Promise<any>,
    stage?: stageRequestSent
  }
  | {
    +type: T,
    stage: stageReplyReceived,
  }
  | {
    +type: T,
    stage: stageFailureReceived,
    error: any,
  }


declare type SocketsAction<T> = {
    +type: T,
    wsMode: 'me' | 'all' | 'others',
    stage?: stageRequestSent,
  }
  | {
    +type: T,
    stage: stageReplyReceived,
  }
  | {
    +type: T,
    stage: stageFailureReceived,
    error: any,
  }


declare type AsyncAction<T> = PromiseAction<T> | SocketsAction<T> | (PromiseAction<T> & SocketsAction<T>);
