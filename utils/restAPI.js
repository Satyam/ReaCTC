/* eslint-env browser */
import ServerError from '_utils/serverError';
// import dbg from 'debug';
import plainJoin from '_utils/plainJoin';

// dbg.enable('RoxyMusic:restAPI');
// const debug = dbg('RoxyMusic:restAPI');

const clients = {};

export default (base, host = `${HOST}:${PORT}`) => {
  const key = plainJoin(host, base);
  if (clients[key]) return clients[key];
  const restClient = method => (path = '/', body) => {
    if (parseInt(localStorage.getItem('lastAccess'), 10) + SESSION_TIMEOUT < Date.now()) {
      localStorage.removeItem('authorization');
    } else {
      localStorage.setItem('lastAccess', Date.now());
    }
    return fetch(plainJoin(host, REST_API_PATH, base, path), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('authorization'),
      },
      credentials: 'include',
      body: body && JSON.stringify(body),
    })
      .then(
        // prettier-ignore
        response => (
          response.ok
            ? response
            : Promise.reject(
              new ServerError(response.status, response.statusText, method, plainJoin(base, path))
            )
        )
      )
      .then(response => response.json());
    // ----- when debugging
    // .then(
    //   (response) => {
    //     debug(`${method} ${plainJoin(base, path)}: ${JSON.stringify(response, null, 2)}`);
    //     return response;
    //   },
    //   (error) => {
    //     debug(`${method} ${plainJoin(base, path)}: ${JSON.stringify(error, null, 2)}`);
    //     return Promise.reject(error);
    //   }
    // )
    // --
  };
  clients[key] = {
    create: restClient('post'),
    read: restClient('get'),
    update: restClient('put'),
    delete: restClient('delete'),
  };
  return clients[key];
};
