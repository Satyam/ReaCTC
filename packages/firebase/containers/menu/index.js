import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import map from 'lodash/map';
import pick from 'lodash/pick';

import { isPlainClick } from 'ctc-utils';

import { firebaseConnect, firebaseUserConnect } from 'firebase-connect';

import { login, logout } from '_store/actions';

import Menu from '_components/menu';

export const firebaseDataMap = () => ({
  sectores: {
    path: 'sectores',
    fn: result => map(result, value => pick(value, 'idSector', 'descrCorta')),
  },
});

export const firebaseUserDataMap = user => ({
  username: user.isAnonymous ? 'guest' : user.displayName,
});

export const mapDispatchToProps = (dispatch, { history, onClose }) => ({
  onClick: idSector => (ev) => {
    if (isPlainClick(ev)) {
      history.push(`/sector/${idSector}`);
      onClose();
    }
  },
  onLogin: (ev) => {
    if (isPlainClick(ev)) {
      dispatch(login());
      onClose();
    }
  },
  onLogout: (ev) => {
    if (isPlainClick(ev)) {
      dispatch(logout());
      onClose();
    }
  },
  onAdminSectores: (ev) => {
    if (isPlainClick(ev)) {
      history.push('/admin/sectores');
      onClose();
    }
  },
});

export default compose(
  withRouter,
  firebaseUserConnect(firebaseUserDataMap),
  firebaseConnect(firebaseDataMap),
  connect(null, mapDispatchToProps)
)(Menu);
