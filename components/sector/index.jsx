import React from 'react';
import PropTypes from 'prop-types';

import Celda from '_containers/celda';

import { ANCHO_CELDA } from '../common';

export default function SectorComponent({ ancho, alto, celdas }) {
  return ancho * alto > 0
    ? <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
      {celdas.map(idCelda => <Celda key={idCelda} idCelda={idCelda} />)}
    </svg>
    : <img alt="loading..." src="/loading.gif" />;
}
SectorComponent.propTypes = {
  ancho: PropTypes.number,
  alto: PropTypes.number,
  celdas: PropTypes.arrayOf(PropTypes.string),
};
