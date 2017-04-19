import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { ANCHO_CELDA } from '_components/celda/common';

import Celda from '_components/celda';


import initStore from '_utils/initStore';

import { getSector } from '_store/actions';
import { selSector } from '_store/selectors';

export function SectorComponent({ match, ancho, alto, celdas }) {
  const idSector = match.params.idSector;
  return (
    typeof ancho === 'undefined' // Any property would do just as well
    ? <img alt="loading..." src="/loading.gif" />
  : (
    <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
      {celdas.map((idCelda) => {
        const coords = idCelda.split(':')[1];
        return <Celda key={coords} coords={coords} idSector={idSector} />;
      })}
    </svg>
    )
  );
}
SectorComponent.propTypes = {
  match: PropTypes.object,
  ancho: PropTypes.number,
  alto: PropTypes.number,
  celdas: PropTypes.arrayOf(PropTypes.string),
};

export const storeInitializer = (dispatch, state, { match }) =>
  dispatch(getSector(match.params.idSector));

export const mapStateToProps = (state, { match }) => selSector(state, match.params.idSector);

export default compose(initStore(storeInitializer), connect(mapStateToProps))(SectorComponent);
