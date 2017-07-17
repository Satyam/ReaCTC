import { NAME } from './constants';
/* eslint-disable import/prefer-default-export */

export function selIsPending(state, ...args) {
  return state[NAME].pending.includes(args.join('|'));
}
