// @flow
/* eslint-env browser */
import ServerError from '_utils/serverError';
// import dbg from 'debug';
import plainJoin from '_utils/plainJoin';

// dbg.enable('RoxyMusic:restAPI');
// const debug = dbg('RoxyMusic:restAPI');

const clients = {};

export default (
  base: string,
  host: string = `${HOST}:${PORT}`
): {
  create: (path: ?string, body: Object) => Promise<Object>,
  read: (path: ?string) => Promise<Object>,
  update: (path: ?string, body: Object) => Promise<Object>,
  delete: (path: ?string) => Promise<Object>,
} => {
  const key = plainJoin(host, base);
  if (clients[key]) return clients[key];
  const restClient = method => async (path: ?string = '/', body: any): Promise<Object> => {
    if (parseInt(localStorage.getItem('lastAccess'), 10) + SESSION_TIMEOUT < Date.now()) {
      localStorage.removeItem('authorization');
    } else {
      localStorage.setItem('lastAccess', String(Date.now()));
    }
    const response: Response = await fetch(plainJoin(host, REST_API_PATH, base, path), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('authorization') || '',
      },
      credentials: 'include',
      body: body && JSON.stringify(body),
    });
    if (!response.ok) {
      throw new ServerError(response.status, response.statusText, method, plainJoin(base, path));
    }
    return response.json();
  };
  clients[key] = {
    create: restClient('post'),
    read: restClient('get'),
    update: restClient('put'),
    delete: restClient('delete'),
  };
  return clients[key];
};
