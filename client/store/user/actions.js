import asyncActionCreator from '_utils/asyncActionCreator';
import restAPI, { setAuthorization } from '_platform/restAPI';

import { NAME, LOGIN, LOGOUT, SIGNUP } from './constants';

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
          setAuthorization(response.success ? response.token : '');
          return response;
        }),
        {
          username,
        }
      )
    );
  };
}

export function logout() {
  return asyncActionCreator(LOGOUT, api.read('logout'));
}
