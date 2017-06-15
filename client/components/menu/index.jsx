import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import {
  List,
  ListItem,
  ListSubHeader,
  ListDivider /* , ListCheckbox */,
} from 'react-toolbox/lib/list';

import initStore from '_utils/initStore';
import isPlainClick from '_utils/isPlainClick';
import { listSectores } from '_store/actions';
import { selSectores, selUsername } from '_store/selectors';

export function MenuComponent({
  sectores,
  location,
  username,
  onClick,
  onLogin,
  onLogout,
  onAdminSectores,
}) {
  const loggedIn = username && username !== 'guest';
  return (
    <List selectable>
      <ListSubHeader caption="Recientes" />
      {sectores.map(sector =>
        (<ListItem
          key={sector.idSector}
          onClick={onClick(sector.idSector)}
          caption={sector.descrCorta}
          disabled={`/sector/${sector.idSector}` === location.pathname}
        />)
      )}
      <ListDivider />
      <ListSubHeader caption="Whatever else" />
      <ListItem caption="Admin Sectores" onClick={onAdminSectores} />
      <ListDivider />
      <ListItem caption={loggedIn ? 'Logout' : 'Login'} onClick={loggedIn ? onLogout : onLogin} />
    </List>
  );
}

MenuComponent.propTypes = {
  sectores: PropTypes.arrayOf(
    PropTypes.shape({
      idSector: PropTypes.string,
      descrCorta: PropTypes.string,
    })
  ),
  username: PropTypes.string,
  location: PropTypes.object,
  onClick: PropTypes.func,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onAdminSectores: PropTypes.func,
};

export const storeInitializer = dispatch => dispatch(listSectores());

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
)(MenuComponent);
