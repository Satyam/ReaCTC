import forEach from 'lodash/forEach';
import { join } from 'path';

import sectores from './sectores';
import celdas from './celdas';
import senales from './senales';
import enclavamientos from './enclavamientos';

const handleRequest = actions => (req, res) =>
  []
    .concat(actions)
    .reduce((p, next) => p.then(next), Promise.resolve(req))
    .then(reply => res.json(reply))
    .catch((reason) => {
      res.status(reason.code || 500).send(reason.toString());
    });

const equivalent = {
  create: 'post',
  read: 'get',
  update: 'put',
  delete: 'delete',
};

export default function (db, dataRouter) {
  const addToDataRouter = prefix => (routes) => {
    forEach(routes, (operations, route) => {
      forEach(operations, (actions, operation) =>
        dataRouter[equivalent[operation]](join(prefix, route), handleRequest(actions))
      );
    });
  };
  return Promise.all([
    // this repeats for each data server:
    sectores(db).then(addToDataRouter('/sectores')),
    celdas(db).then(addToDataRouter('/celdas')),
    senales(db).then(addToDataRouter('/senales')),
    enclavamientos(db).then(addToDataRouter('/enclavamientos')),
    // and so on ....
  ]);
}
