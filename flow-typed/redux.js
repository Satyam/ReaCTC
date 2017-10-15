// @flow
declare type stageRequestSent = 'Stage: request sent';
declare type stageReplyReceived = 'Stage: reply received';
declare type stageFailureReceived = 'Stage: failure received';

declare type PromiseAction = {
    +type: string,
    promise: Promise<any>,
    stage?: stageRequestSent | stageReplyReceived
  }
  | {
    +type: string,
    stage: stageFailureReceived,
    error: any,
  }


declare type SocketsAction = {
    +type: string,
    wsMode: 'me' | 'all' | 'others',
    stage?: stageRequestSent | stageReplyReceived,
  }
  | {
    +type: string,
    wsMode: 'me' | 'all' | 'others',
    stage: stageFailureReceived,
    error: any,
  }


declare type AsyncAction = PromiseAction | SocketsAction | (PromiseAction & SocketsAction);
