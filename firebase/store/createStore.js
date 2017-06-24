import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import promiseMiddleware from '_utils/promiseMiddleware';

// import sectores from './sectores';
// import celdas from './celdas';
// import senales from './senales';
import requests from './requests';
import estado from './estado';
import mensajes from './mensajes';
// import enclavamientos from './enclavamientos';
import user from './user';

const reducers = combineReducers({
  // sectores,
  // celdas,
  // senales,
  requests,
  estado,
  mensajes,
  // enclavamientos,
  user,
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
