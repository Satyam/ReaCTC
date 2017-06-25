import React from 'react';
import PropTypes from 'prop-types';

import Celda from '_containers/celda';

import { ANCHO_CELDA } from '../common';

export default function SectorComponent({ ancho, alto, celdas }) {
  return typeof ancho === 'undefined' // Any property would do just as well
    ? <img alt="loading..." src="/loading.gif" />
    : <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
      {celdas.map(idCelda => <Celda key={idCelda} idCelda={idCelda} />)}
    </svg>;
}
SectorComponent.propTypes = {
  ancho: PropTypes.number,
  alto: PropTypes.number,
  celdas: PropTypes.arrayOf(PropTypes.string),
};
