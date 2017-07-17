import React from 'react';
import PropTypes from 'prop-types';

import {
  List,
  ListItem,
  ListSubHeader,
  ListDivider /* , ListCheckbox */,
} from 'react-toolbox/lib/list';

export default function MenuComponent({
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
      {(sectores || null) &&
        sectores.map(sector =>
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onClick: PropTypes.func,
  onLogin: PropTypes.func,
  onLogout: PropTypes.func,
  onAdminSectores: PropTypes.func,
};
