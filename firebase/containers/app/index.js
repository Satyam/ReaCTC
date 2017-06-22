import { withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';

import firebaseConnect from '_utils/firebase/connect';
import firebaseUserConnect from '_utils/firebase/user';

import App from '_components/app';

export const listeners = ({ location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  return {
    sector: match && `sectores/${match.params.idSector}`,
  };
};

// prettier-ignore
export default compose(
  withRouter,
  firebaseUserConnect(user => ({
    username: user.isAnonymous ? 'guest' : user.displayName,
    photoURL: user.photoURL,
  })),
  firebaseConnect(listeners),
)(App);
