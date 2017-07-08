import forEach from 'lodash/forEach';
import { join } from 'path';

import sectores from './sectores';

export default function (db, routeAdd) {
  function addToDataRouter(prefix, routes) {
    forEach(routes, (operations, route) => {
      forEach(operations, (actions, operation) =>
        routeAdd(operation, join(prefix, route), actions)
      );
    });
  }
  return Promise.all([sectores(db).then(routes => addToDataRouter('/sectores', routes))]);
}
