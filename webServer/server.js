import http from 'http';
import { join } from 'path';
import express, { Router as createRouter } from 'express';
import passport from 'passport';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import denodeify from 'denodeify';

import dataServers from '_server';

import { setStrategy, signup, login, logout } from './userAccess';

const absPath = relPath => join(ROOT_DIR, relPath);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

const dataRouter = createRouter();

app.use(morgan('dev'));
// To make this server CORS-ENABLEd
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(`${REST_API_PATH}/user/signup`, bodyParser.json(), signup);
app.use(`${REST_API_PATH}/user/login`, bodyParser.json(), login);
app.use(`${REST_API_PATH}/user/logout`, logout);

app.use(passport.initialize());

app.use(
  REST_API_PATH,
  passport.authenticate('jwt', { session: false }),
  bodyParser.json(),
  dataRouter
);

app.use('/bundles', express.static(absPath('bundles')));
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
    user: req.user || {},
  };

  return []
    .concat(actions)
    .reduce((p, next) => p.then(next), Promise.resolve(o))
    .then(reply => res.json(reply))
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
    .then(db => dataServers(db, addRoute).then(() => setStrategy(passport, db)))
    .then(() => listen(PORT));
}
export function stop() {
  return close();
}
