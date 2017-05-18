import asyncActionCreator from '_utils/asyncActionCreator';
import restAPI from '_platform/restAPI';

import { NAME, LOGIN, LOGOUT, SIGNUP, GET_DATA } from './constants';

import { selIsLoggedIn } from './selectors';

const api = restAPI(NAME);

export function login(username, password, signup) {
  return (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return Promise.resolve();
    }
    return dispatch(
      asyncActionCreator(
        signup ? LOGIN : SIGNUP,
        api.create(signup ? 'signup' : 'login', { username, password }).then((response) => {
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
        {
          username,
        }
      )
    );
  };
}

export function getUserData(username) {
  return (dispatch, getState) => {
    if (selIsLoggedIn(getState(), username)) {
      return Promise.resolve();
    }
    return dispatch(
      asyncActionCreator(
        GET_DATA,
        api.read(`/data/${username}`),
        {
          username,
        }
      )
    );
  };
}

export function logout() {
  localStorage.removeItem('authorization');
  localStorage.removeItem('username');
  return asyncActionCreator(LOGOUT, api.read('logout'));
}
