import { withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import initStore from '_utils/initStore';
import firebaseConnect from '_utils/firebase/connect';

import { logout, ensureUser } from '_store/actions';
import { selUsername } from '_store/selectors';

import App from '_components/app';

export const storeInitializer = (dispatch, getState, { location, history }) => {
  if (matchPath(location.pathname, { path: '/logout' })) {
    return dispatch(logout()).then(() => history.replace('/'));
  }
  return dispatch(ensureUser());
};

export const listeners = ({ location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  return {
    sector: match && `sectores/${match.params.idSector}`,
  };
};

export const mapStateToProps = state => ({ username: selUsername(state) });

// prettier-ignore
export default compose(
  withRouter,
  initStore(storeInitializer),
  connect(mapStateToProps),
  firebaseConnect(listeners),
)(App);
