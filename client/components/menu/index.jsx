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
import { getSectores } from '_store/actions';
import { selSectores } from '_store/selectors';

export function MenuComponent({ sectores, location, onClick }) {
  return (
    <List selectable>
      <ListSubHeader caption="Recientes" />
      {sectores.map(sector => (
        <ListItem
          key={sector.idSector}
          onClick={onClick(sector.idSector)}
          caption={sector.descrCorta}
          disabled={`/sector/${sector.idSector}` === location.pathname}
        />
      ))}
      <ListDivider />
      <ListSubHeader caption="Whatever else" />
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
  location: PropTypes.object,
  onClick: PropTypes.func,
};

export const storeInitializer = dispatch => dispatch(getSectores());

export const mapStateToProps = state => ({
  sectores: selSectores(state),
});

export const mapDispatchToProps = (dispatch, { history, onClose }) => ({
  onClick: idSector => (ev) => {
    if (isPlainClick(ev)) {
      history.push(`/sector/${idSector}`);
      onClose();
    }
  },
});

export default compose(
  initStore(storeInitializer),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MenuComponent);
