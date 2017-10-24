// @flow
declare type PlainAction<T, P = void> = {
  +type: T,
  payload: P,
};

declare type stageRequestSent = 'Stage: request sent';
declare type stageReplyReceived = 'Stage: reply received';
declare type stageFailureReceived = 'Stage: failure received';

declare type PromiseAction<T, Req, Res = Req> = {
    +type: T,
    payload: Req,
    promise: Promise<any>,
    stage?: stageRequestSent
  }
  | {
    +type: T,
    payload: Res,
    stage: stageReplyReceived,
  }
  | {
    +type: T,
    payload: Req | Res,
    stage: stageFailureReceived,
    error: any,
  }


declare type SocketsAction<T, Req, Res = Req> = {
    +type: T,
    wsMode: 'me' | 'all' | 'others',
    stage?: stageRequestSent,
    payload: Req,
  }
  | {
    +type: T,
    stage: stageReplyReceived,
    payload: Res,
  }
  | {
    +type: T,
    stage: stageFailureReceived,
    payload: Req | Res,
    error: any,
  }

type BothActionsCombined<T, Req, Res = Req> = PromiseAction<T, Req, Res> & SocketsAction<T, Req, Res>;
declare type AsyncAction<T, Req, Res = Req> = PromiseAction<T, Req, Res> | SocketsAction<T, Req, Res> |  BothActionsCombined<T, Req, Res>;
