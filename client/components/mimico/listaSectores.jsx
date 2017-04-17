import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Dropdown from 'react-toolbox/lib/dropdown';

import initStore from '_utils/initStore';

import { getSectores } from '_store/actions';
import { selSectores } from '_store/selectors';

export function ListaSectoresComponent({ sectores, onChange }) {
  return (
    <Dropdown
      auto
      onChange={onChange}
      source={sectores.map(sector => ({
        label: sector.descrCorta,
        value: sector.idSector,
      }))}
    />
  );
}

ListaSectoresComponent.propTypes = {
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

export default compose(
  initStore(storeInitializer),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ListaSectoresComponent);
