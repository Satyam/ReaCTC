import { NAME } from './constants';

export function selIsLoggedIn(state, username) {
  return state[NAME].displayName === username;
}

export function selUsername(state) {
  const user = state[NAME];
  return user.isAnonymous ? 'guest' : user.displayName;
}
