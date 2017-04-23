import http from 'http';
import { join } from 'path';
import express, { Router as createRouter } from 'express';
import { MongoClient } from 'mongodb';
import dbg from 'debug';

import bodyParser from 'body-parser';
import denodeify from 'denodeify';

import dataServers from '_server';

const absPath = relPath => join(ROOT_DIR, relPath);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

const dataRouter = createRouter();
dbg.enable('CTC:server/server');
const debug = dbg('CTC:server/server');

app.use(REST_API_PATH, bodyParser.json(), /* showRequest, */ dataRouter);

app.use('/bundles', express.static(absPath('bundles')));
// app.get(join(REST_API_PATH, 'sectores'), (req, res) => {
//   res.json({
//     list: [
//       {
//         idSector: 'constitucion',
//         descrCorta: 'Constitución',
//       },
//       {
//         idSector: 'retiro',
//         descrCorta: 'Retiro',
//       },
//     ],
//   });
// });
//
// app.get(join(REST_API_PATH, 'sectores/:idSector'), (req, res) => {
//   res.sendFile(`${absPath('webServer/data')}/${req.params.idSector}.json`);
// });
app.use(express.static(absPath('webServer/public')));

app.get('/kill', (req, res) => {
  res.send('I am dead');
  close();
  process.exit();
});

app.get('*', (req, res) => res.sendFile(absPath('webServer/index.html')));

const handleRequest = actions => (req, res) => {
  const o = {
    keys: req.params || {},
    data: req.body,
    options: req.query || {},
  };

  debug('> %s %s %j', req.method, req.url, o);
  return []
    .concat(actions)
    .reduce((p, next) => p.then(next), Promise.resolve(o))
    .then((reply) => {
      debug('< %s %s %j', req.method, req.url, reply);
      return res.json(reply);
    })
    .catch((reason) => {
      res.status(reason.code || 500).send(reason.toString());
    });
};
const equivalent = {
  create: 'post',
  read: 'get',
  update: 'put',
  delete: 'delete',
};

function addRoute(operation, path, actions) {
  dataRouter[equivalent[operation]](path, handleRequest(actions));
}

export function start() {
  return MongoClient.connect('mongodb://localhost:27017/CTC')
    .then(db => dataServers(db, addRoute))
    .then(() => listen(PORT));
}
export function stop() {
  return close();
}
