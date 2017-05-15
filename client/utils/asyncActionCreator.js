import { REQUEST_SENT, REPLY_RECEIVED, FAILURE_RECEIVED } from '_store/requests/constants';

export default (type, asyncRequest, payload = {}, meta) => (dispatch) => {
  dispatch({
    type,
    stage: REQUEST_SENT,
    payload,
    meta,
  });
  return asyncRequest.then(
    response =>
      dispatch({
        type,
        stage: REPLY_RECEIVED,
        payload: Object.assign(
          {},
          payload,
          Array.isArray(response) ? { list: response } : response
        ),
        meta,
      }),
    (error) => {
      dispatch({
        type,
        stage: FAILURE_RECEIVED,
        payload,
        error: error.toString(),
        meta,
      });
      return Promise.reject(error);
    }
  );
};
