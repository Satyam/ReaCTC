import restAPI from '_utils/restAPI';

import { NAME, LOGIN, LOGOUT, SIGNUP, GET_DATA } from './constants';

import { selIsLoggedIn, selUsername } from './selectors';

const api = restAPI(NAME);

async function doLogin(username, password, signup) {
  const response = await api.create(signup ? 'signup' : 'login', { username, password });
  if (response.success) {
    localStorage.setItem('authorization', response.token);
    localStorage.setItem('username', username);
    localStorage.setItem('lastAccess', Date.now());
  } else {
    localStorage.removeItem('authorization');
    localStorage.removeItem('username');
  }
  return response;
}

export function login(username, password, signup) {
  return async (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return;
    }
    await dispatch({
      type: signup ? LOGIN : SIGNUP,
      promise: doLogin(username, password, signup),
      payload: {
        username,
      },
    });
  };
}

export function getUserData(username) {
  return async (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return;
    }
    await dispatch({
      type: GET_DATA,
      promise: api.read(`/data/${username}`),
      payload: {
        username,
      },
    });
  };
}

export function ensureUser() {
  return async (dispatch, getState) => {
    const lastAccess = parseInt(localStorage.getItem('lastAccess') || 0, 10);
    if (lastAccess + SESSION_TIMEOUT < Date.now()) {
      // logged out due to timeout or never logged in
      await dispatch(login('guest', 'guest'));
      return;
    }
    // refresh timeout
    localStorage.setItem('lastAccess', Date.now());
    const storageUsername = localStorage.getItem('username');
    // if the remembered username is the same as the one in storage
    // the data is there already, no need to fetch it.
    if (selUsername(getState()) === storageUsername) {
      return;
    }
    await dispatch(getUserData(storageUsername));
  };
}

export function logout() {
  return async (dispatch) => {
    localStorage.removeItem('authorization');
    localStorage.removeItem('username');
    localStorage.removeItem('lastAccess');
    await dispatch({
      type: LOGOUT,
      promise: api.read('logout'),
    });
    await dispatch(login('guest', 'guest'));
  };
}
