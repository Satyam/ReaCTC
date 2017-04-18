import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose'; // import PropTypes from 'prop-types';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';

import initStore from '_utils/initStore';

import { getSectores } from '_store/actions';
import { selSectores } from '_store/selectors';

export function MenuComponent({ sectores }) {
  return (
    <List>
      <ListSubHeader caption="Recientes" />
      {sectores.map(sector => (
        <ListItem key={sector.idSector} to={sector.idSector} caption={sector.descrCorta} />
      ))}
      <ListDivider />
      <ListItem value="signout" icon="delete" caption="Delete" disabled />
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
  onChange: PropTypes.func,
};
export const storeInitializer = dispatch => dispatch(getSectores());

export const mapStateToProps = state => ({
  sectores: selSectores(state) || [{ descrCorta: '----' }],
});

export const mapDispatchToProps = (dispatch, { history }) => ({
  onChange: (value) => {
    history.push(value);
  },
});

export default compose(initStore(storeInitializer), connect(mapStateToProps, mapDispatchToProps))(
  MenuComponent
);
