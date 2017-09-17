import http from 'http';
import { join } from 'path';
import express, { Router as createRouter } from 'express';
import compression from 'compression';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';

import bodyParser from 'body-parser';
import denodeify from 'denodeify';

import restServers from './restServers';
import socketServers from './socketServers';

import { userRoutes, setStrategy, authenticate } from './userAccess';

const absPath = relPath => join(ROOT_DIR, relPath);

const app = express();
const server = http.createServer(app);

const listen = denodeify(server.listen.bind(server));
const close = denodeify(server.close.bind(server));

app.use(compression());
app.use(morgan('dev'));
// To make this server CORS-ENABLEd
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

userRoutes(app, `${REST_API_PATH}/user`);

const dataRouter = createRouter();

app.use(REST_API_PATH, authenticate, bodyParser.json(), dataRouter);

app.use(express.static(absPath('public')));

app.get('/kill', (req, res) => {
  res.send('I am dead');
  close();
  process.exit();
});

app.get('*', (req, res) => res.sendFile(absPath('public/index.html')));
// app.get('*', (req, res) => res.sendFile(absPath('webServer/index.html')));

export function start() {
  return MongoClient.connect('mongodb://localhost:27017/CTC').then(db =>
    restServers(db, dataRouter)
      .then(() => socketServers(db, server))
      .then(() => setStrategy(db))
      .then(() => listen(PORT))
  );
}
export function stop() {
  return close();
}
