import { CLEAR_HTTP_ERRORS } from './constants';

export function clearHttpErrors() {
  return { type: CLEAR_HTTP_ERRORS };
}
