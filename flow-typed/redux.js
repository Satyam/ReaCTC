// @flow
declare type stageRequestSent = 'Stage: request sent';
declare type stageReplyReceived = 'Stage: reply received';
declare type stageFailureReceived = 'Stage: failure received';

declare type PromiseAction<T, Req = void, Res = Req> = {
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


declare type SocketsAction<T, Req = void, Res = Req> = {
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

type BothActionsCombined<T, Req = void, Res = Req> = PromiseAction<T, Req, Res> & SocketsAction<T, Req, Res>;
declare type AsyncAction<T, Req = void, Res = Req> = PromiseAction<T, Req, Res> | SocketsAction<T, Req, Res> |  BothActionsCombined<T, Req, Res>;

declare type ActionCreator<T, P = void> = {
  +type: T,
  payload: P,
};
