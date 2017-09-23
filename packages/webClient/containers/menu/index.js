import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import initStore from 'init-store';
import { isPlainClick } from 'ctc-utils';
import { listSectores } from '_store/actions';
import { selSectores, selUsername } from '_store/selectors';

import Menu from '_components/menu';

export const storeInitializer = (dispatch, getState) =>
  selUsername(getState()) && dispatch(listSectores());

export const mapStateToProps = state => ({
  sectores: selSectores(state),
  username: selUsername(state),
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
      history.push('/login');
      onClose();
    }
  },
  onLogout: (ev) => {
    if (isPlainClick(ev)) {
      history.push('/logout');
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
  initStore(storeInitializer),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Menu);
