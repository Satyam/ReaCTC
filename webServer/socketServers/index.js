import WebSocket from 'ws';

import sectores from './sectores';

const operators = {};

export default function socketServers(db, server) {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws /* , req */) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
      const { wsMode, ...action } = JSON.parse(message);
      const operator = operators[action.type];
      (operator
        ? operator(action.payload).then((data) => {
          if (Array.isArray(data)) {
            action.payload = {
              ...action.payload,
              list: data,
            };
          } else Object.assign(action.payload, data);
        })
        : Promise.reject('action type not supported'))
        .catch((error) => {
          action.error = error;
        })
        .then(() => {
          const reply = JSON.stringify(action);
          if (wsMode === 'me') {
            ws.send(reply);
          } else {
            wss.clients.forEach((client) => {
              if (
                client.readyState === WebSocket.OPEN &&
                (wsMode === 'all' || (wsMode === 'other' && client !== ws))
              ) {
                client.send(reply);
              }
            });
          }
        });
    });
  });
  return Promise.all([
    // this repeats for each data server:
    sectores(db).then(routes => Object.assign(operators, routes)),
  ]);
}
