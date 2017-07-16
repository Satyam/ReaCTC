import React from 'react';
import { sectorType } from '_components/shapes';
import { Helmet } from 'react-helmet';

import Celda from '_containers/celda';

import { ANCHO_CELDA } from '../common';

export default function SectorComponent({ ancho, alto, celdas, descrCorta }) {
  return (
    <div>
      <Helmet>
        <title>
          {descrCorta}
        </title>
      </Helmet>
      {ancho * alto > 0
        ? <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
          {celdas.map(idCelda => <Celda key={idCelda} idCelda={idCelda} />)}
        </svg>
        : <img alt="loading..." src="/loading.gif" />}
    </div>
  );
}

SectorComponent.propTypes = sectorType;
