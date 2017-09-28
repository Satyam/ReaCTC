import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import promiseMiddleware from '_utils/promiseMiddleware';
import socketsMiddleware from '_utils/socketsMiddleware';

import sectores from './sectores/reducer';
import celdas from './celdas/reducer';
import senales from './senales/reducer';
import requests from './requests/reducer';
import estado from './estado/reducer';
import mensajes from './mensajes/reducer';
import enclavamientos from './enclavamientos/reducer';
import user from './user/reducer';

const reducers = combineReducers({
  sectores,
  celdas,
  senales,
  requests,
  estado,
  mensajes,
  enclavamientos,
  user,
});

export default (history, initialState) => {
  const middlewares = [reduxThunk, promiseMiddleware];
  const enhancers = [];

  if (BUNDLE === 'wsClient') middlewares.push(socketsMiddleware);
  if (process.env.NODE_ENV !== 'production') {
    if (BUNDLE === 'cordova' /* || BUNDLE === 'webServer' */) {
      middlewares.push(
        /* eslint-disable global-require */
        require('_utils/reduxLogger').default
        /* eslint-enable global-require */
      );
      /* eslint-disable no-console */
      if (!console.group) {
        console.group = console.log;
        console.groupEnd = console.log;
      }
      /* eslint-enable no-console */
      /* eslint-disable no-underscore-dangle */
    } else if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
      enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
      /* eslint-enable no-underscore-dangle */
    }
  }
  enhancers.unshift(applyMiddleware(...middlewares));
  return createStore(reducers, initialState, compose(...enhancers));
};
