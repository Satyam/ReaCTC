import { withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';

import { firebaseConnect, firebaseUserConnect } from 'firebase-connect';

import App from '_components/app';

export const firebaseDataMap = ({ location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  return {
    sector: match && `sectores/${match.params.idSector}`,
  };
};
export const firebaseUserDataMap = user => ({
  username: user.isAnonymous ? 'guest' : user.displayName,
  photoURL: user.photoURL,
});

// prettier-ignore
export default compose(
  withRouter,
  firebaseUserConnect(firebaseUserDataMap),
  firebaseConnect(firebaseDataMap),
)(App);
