/* globals WebSocket:false */
import cuid from 'cuid';

import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from './promiseMiddleware';

const socket = new WebSocket(`${HOST}:${PORT}`.replace('http://', 'ws://'));

const pendingReplies = {};

export default ({ dispatch }) => {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('received', data);
    const uid = data.meta;
    if (uid) {
      const completion = pendingReplies[uid];
      if (completion) {
        delete pendingReplies[uid];
        completion[data.error ? 1 : 0](data);
      }
    }
    if (data.error) {
      dispatch({
        ...data,
        stage: FAILURE_RECEIVED,
      });
    } else {
      dispatch({
        ...data,
        stage: REPLY_RECEIVED,
      });
    }
  };
  socket.onerror = (ev) => {
    console.error('socket error', ev);
  };
  socket.onclose = (ev) => {
    console.error('socket closed', ev);
    dispatch({
      type: 'error',
      stage: FAILURE_RECEIVED,
      error: ev.code,
      reason: ev.reason,
    });
  };
  return next => (action) => {
    const { wsMode, stage, ...act } = action;
    console.log('sent request', action.type, wsMode, stage);
    if (wsMode && !stage) {
      if (wsMode !== 'others') {
        return new Promise((...completion) => {
          const uid = cuid();
          pendingReplies[uid] = completion;
          socket.send(
            JSON.stringify({
              ...action,
              meta: uid,
            })
          );
          next({
            ...act,
            stage: REQUEST_SENT,
          });
        });
      }
      socket.send(JSON.stringify(action));
      return next({
        ...act,
        stage: REQUEST_SENT,
      });
    }
    return next(action);
  };
};
