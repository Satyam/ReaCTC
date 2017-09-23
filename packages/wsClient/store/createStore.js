import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { promiseMiddleware, socketsMiddleware } from 'redux-middleware';

import sectores from '_webClient/store/sectores/reducer';
import celdas from '_webClient/store/celdas/reducer';
import senales from '_webClient/store/senales/reducer';
import requests from '_webClient/store/requests/reducer';
import estado from '_webClient/store/estado/reducer';
import mensajes from '_webClient/store/mensajes/reducer';
import enclavamientos from '_webClient/store/enclavamientos/reducer';
import user from '_webClient/store/user/reducer';

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
  const middlewares = [reduxThunk, promiseMiddleware, socketsMiddleware];
  const enhancers = [];

  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-underscore-dangle */
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
      enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
      /* eslint-enable no-underscore-dangle */
    }
  }
  enhancers.unshift(applyMiddleware(...middlewares));
  return createStore(reducers, initialState, compose(...enhancers));
};
