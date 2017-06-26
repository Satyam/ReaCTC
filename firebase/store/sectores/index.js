import { combineReducers } from 'redux';

import { adminStatus } from '_webClient/store/sectores/reducer';

export default combineReducers({
  adminStatus,
});

export * from './actions';
export * from './selectors';
