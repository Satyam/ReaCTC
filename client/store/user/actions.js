import restAPI from '_platform/restAPI';

import { NAME, LOGIN, LOGOUT, SIGNUP, GET_DATA } from './constants';

import { selIsLoggedIn, selUsername } from './selectors';

const api = restAPI(NAME);

export function login(username, password, signup) {
  return (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return Promise.resolve();
    }
    return dispatch({
      type: signup ? LOGIN : SIGNUP,
      promise: api.create(signup ? 'signup' : 'login', { username, password }).then((response) => {
        if (response.success) {
          localStorage.setItem('authorization', response.token);
          localStorage.setItem('username', username);
          localStorage.setItem('lastAccess', Date.now());
        } else {
          localStorage.removeItem('authorization');
          localStorage.removeItem('username');
        }
        return response;
      }),
      payload: {
        username,
      },
    });
  };
}

export function getUserData(username) {
  return (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return Promise.resolve();
    }
    return dispatch({
      type: GET_DATA,
      promise: api.read(`/data/${username}`),
      payload: {
        username,
      },
    });
  };
}

export function ensureUser() {
  return (dispatch, getState) => {
    const storeUsername = selUsername(getState());
    const lastAccess = parseInt(localStorage.getItem('lastAccess'), 10);
    const storageUsername = lastAccess + SESSION_TIMEOUT < Date.now()
      ? ''
      : localStorage.getItem('username');
    if (storeUsername) {
      if (storageUsername) {
        if (storeUsername === storageUsername) {
          return true;
        }
        return dispatch(getUserData(storageUsername));
      }
      return dispatch(login('guest', 'guest'));
    } else if (storageUsername) {
      return dispatch(getUserData(storageUsername));
    }
    return dispatch(login('guest', 'guest'));
  };
}

export function logout() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('username');
  localStorage.removeItem('lastAccess');
  return {
    type: LOGOUT,
    promise: api.read('logout'),
  };
}
