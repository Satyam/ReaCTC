import { NAME } from './constants';

export function selIsPending(state, ...args) {
  return state[NAME].pending.includes(args.join('|'));
}
