import { CLEAR_HTTP_ERRORS } from './constants';
/* eslint-disable import/prefer-default-export */

export function clearHttpErrors() {
  return { type: CLEAR_HTTP_ERRORS };
}
