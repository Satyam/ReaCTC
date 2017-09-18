import { withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';

import firebaseConnect from '_utils/firebase/connect';
import firebaseUserConnect from '_utils/firebase/user';

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
