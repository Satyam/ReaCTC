import restAPI from '_platform/restAPI';

import { NAME, LOGIN, LOGOUT, SIGNUP, GET_DATA, USER_CHANGED } from './constants';

import { selIsLoggedIn } from './selectors';

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

let authUnsuscribe = null;
export function ensureUser() {
  return (dispatch, getState, firebase) => {
    const auth = firebase.auth();
    if (!authUnsuscribe) {
      authUnsuscribe = auth.onAuthStateChanged(user => dispatch({
        type: USER_CHANGED,
        payload: user,
      }));
    }
    const user = auth.currentUser;
    return (
      user
        ? Promise.resolve(user)
        : auth.signInAnonymously().catch((error) => {
          console.error(error);
        })
    );
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
