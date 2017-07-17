import React from 'react';
import { sectorShape } from '_components/shapes';
import { Helmet } from 'react-helmet';

import Celda from '_containers/celda';

import { ANCHO_CELDA } from '../common';

export default function SectorComponent({ sector }) {
  if (!sector) return <img alt="loading..." src="/loading.gif" />;
  const { ancho, alto, celdas, descrCorta } = sector;
  return (
    <div>
      <Helmet>
        <title>
          {descrCorta}
        </title>
      </Helmet>
      <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
        {celdas.map(idCelda => <Celda key={idCelda} idCelda={idCelda} />)}
      </svg>
    </div>
  );
}

SectorComponent.propTypes = {
  sector: sectorShape,
};
