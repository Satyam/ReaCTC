import http from 'http';
import { join } from 'path';
import express from 'express';
// import dbg from 'debug';

// import bodyParser from 'body-parser';
import denodeify from 'denodeify';
// import fs from 'fs';
//
// import dataServers from '_server';

const absPath = relPath => join(ROOT_DIR, relPath);

// const unlink = denodeify(fs.unlink);
// const readFile = denodeify(fs.readFile);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

// const dataRouter = createRouter();
// dbg.enable('RoxyMusic:server/server');
// const debug = dbg('RoxyMusic:server/server');

// app.use(REST_API_PATH, bodyParser.json(), /* showRequest, */ dataRouter);

app.use('/bundles', express.static(absPath('bundles')));
app.get('/data/sectores', (req, res) => {
  res.json({
    list: ['constitucion', 'retiro'],
  });
});

app.use('/data', express.static(absPath('data')));
app.use(express.static(absPath('webServer/public')));

app.get('/kill', (req, res) => {
  res.send('I am dead');
  close();
  process.exit();
});

app.get('*', (req, res) => res.sendFile(absPath('webServer/index.html')));

// const handleRequest = actions => (req, res) => {
//   const o = {
//     keys: req.params || {},
//     data: req.body,
//     options: req.query || {},
//   };
//
//   debug('> %s %s %j', req.method, req.url, o);
//   return [].concat(actions).reduce(
//     (p, next) => p.then(next),
//     Promise.resolve(o)
//   )
//   .then((reply) => {
//     debug('< %s %s %j', req.method, req.url, reply);
//     return res.json(reply);
//   })
//   .catch((reason) => {
//     res.status(reason.code || 500).send(reason.toString());
//   });
// };
// const equivalent = {
//   create: 'post',
//   read: 'get',
//   update: 'put',
//   delete: 'delete',
// };
//
// function addRoute(operation, path, actions) {
//   dataRouter[equivalent[operation]](path, handleRequest(actions));
// }

export function start() {
  return listen(PORT);
}
export function stop() {
  return close();
}
