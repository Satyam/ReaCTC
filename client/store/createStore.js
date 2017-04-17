import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import sectores from './sectores';
import celdas from './celdas';
import senales from './senales';
import requests from './requests';
import estado from './estado';
import mensajes from './mensajes';

const reducers = combineReducers({
  sectores,
  celdas,
  senales,
  requests,
  estado,
  mensajes,
});

export default (history, initialState) => {
  let enhancer = applyMiddleware(reduxThunk);
  if (process.env.NODE_ENV !== 'production') {
    if (BUNDLE === 'cordova' /* || BUNDLE === 'webServer' */) {
      enhancer = applyMiddleware(
        reduxThunk,
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
    } else if (typeof window !== 'undefined' && window.devToolsExtension) {
      enhancer = compose(enhancer, window.devToolsExtension());
    }
  }
  return createStore(reducers, initialState, enhancer);
};
