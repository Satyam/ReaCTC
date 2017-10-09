// See:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
export default class ServerError extends Error {
  constructor(code = 500, ...params) {
    super(...params);
    Error.captureStackTrace(this, ServerError);
    this.code = code;
  }
}
