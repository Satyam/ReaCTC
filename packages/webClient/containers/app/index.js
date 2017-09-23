import { withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import initStore from 'init-store';
import { selSector, selUsername } from '_store/selectors';
import { logout, ensureUser } from '_store/actions';

import App from '_components/app';

export const storeInitializer = (dispatch, getState, { location, history }) => {
  if (matchPath(location.pathname, { path: '/logout' })) {
    return dispatch(logout()).then(() => history.replace('/'));
  }
  return dispatch(ensureUser());
};

export const mapStateToProps = (state, { location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  const username = selUsername(state);
  return {
    username,
    sector: match && username && selSector(state, match.params.idSector),
  };
};

// prettier-ignore
export default compose(
  withRouter,
  initStore(storeInitializer),
  connect(mapStateToProps)
)(App);
