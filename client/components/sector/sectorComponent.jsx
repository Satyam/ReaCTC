import React from 'react';
import PropTypes from 'prop-types';

import { ANCHO_CELDA } from '_components/celda/common';

import Celda from '_components/celda';

export default function SectorComponent({ match, ancho, alto, celdas }) {
  const idSector = match.params.idSector;
  return typeof ancho === 'undefined' // Any property would do just as well
    ? <img alt="loading..." src="/loading.gif" />
    : <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
      {celdas.map((idCelda) => {
        const coords = idCelda.split(':')[1];
        return <Celda key={coords} coords={coords} idSector={idSector} />;
      })}
    </svg>;
}
SectorComponent.propTypes = {
  match: PropTypes.object,
  ancho: PropTypes.number,
  alto: PropTypes.number,
  celdas: PropTypes.arrayOf(PropTypes.string),
};
