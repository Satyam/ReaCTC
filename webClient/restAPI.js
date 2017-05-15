import ServerError from '_utils/serverError';
// import dbg from 'debug';
import plainJoin from '_utils/plainJoin';

// dbg.enable('RoxyMusic:webClient/restAPI');
// const debug = dbg('RoxyMusic:webClient/restAPI');

const clients = {};
let authorization = '';
let timerId;
const SESSION_TIMEOUT = 20 * 60 * 1000;

export function setAuthorization(auth) {
  authorization = auth;
}

export default (base, host = `${HOST}:${PORT}`) => {
  const key = plainJoin(host, base);
  if (clients[key]) return clients[key];
  const restClient = method => (path = '/', body) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      authorization = '';
    }, SESSION_TIMEOUT);
    return fetch(plainJoin(host, REST_API_PATH, base, path), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorization,
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
  return (clients[key] = {
    create: restClient('post'),
    read: restClient('get'),
    update: restClient('put'),
    delete: restClient('delete'),
  });
};
