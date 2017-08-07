import http from 'http';
import { join } from 'path';
import express, { Router as createRouter } from 'express';
import compression from 'compression';
import passport from 'passport';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import denodeify from 'denodeify';

import dataServers from './dataServers';

import { setStrategy, signup, login, logout, userData } from './userAccess';

const absPath = relPath => join(ROOT_DIR, relPath);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

const dataRouter = createRouter();

app.use(compression());
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

app.get(`${REST_API_PATH}/user/data/:username`, userData);
app.use(express.static(absPath('public')));

app.get('/kill', (req, res) => {
  res.send('I am dead');
  close();
  process.exit();
});

app.get('*', (req, res) => res.sendFile(absPath('webServer/index.html')));

export function start() {
  return MongoClient.connect('mongodb://localhost:27017/CTC')
    .then(db => dataServers(db, dataRouter).then(() => setStrategy(passport, db)))
    .then(() => listen(PORT));
}
export function stop() {
  return close();
}
