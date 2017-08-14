/* globals WebSocket:false */
import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from './promiseMiddleware';

const socket = new WebSocket(`${HOST}:${PORT}`.replace('http://', 'ws://'));

export default (store) => {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('received', data);
    if (data.error) {
      store.dispatch({
        ...data,
        stage: FAILURE_RECEIVED,
      });
    } else {
      store.dispatch({
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
    store.dispatch({
      type: 'error',
      stage: FAILURE_RECEIVED,
      error: ev.code,
      reason: ev.reason,
    });
  };
  return next => (action) => {
    const { wsMode, ...act } = action;
    if (wsMode) {
      socket.send(JSON.stringify(action));
      return next({
        ...act,
        stage: REQUEST_SENT,
      });
    }
    return next(action);
  };
};
