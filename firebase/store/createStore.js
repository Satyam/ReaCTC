import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import promiseMiddleware from '_utils/promiseMiddleware';

import requests from './requests';
import mensajes from './mensajes';
import sectores from './sectores';
import estado from './estado';

const reducers = combineReducers({
  sectores,
  requests,
  mensajes,
  estado,
});

export default ({ initialState, firebase }) => {
  const middlewares = [reduxThunk.withExtraArgument(firebase), promiseMiddleware];
  const enhancers = [];

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
