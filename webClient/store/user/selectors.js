import { NAME } from './constants';

export function selIsLoggedIn(state, username) {
  return state[NAME].username === username;
}

export function selUsername(state) {
  return state[NAME].username;
}
