import React from 'react';
import { paragolpeShape } from '_components/shapes';

import Tramo from './tramo';
import { CENTRO_CELDA, ANCHO_CELDA } from '../common';

export default function Paragolpe({ celda }) {
  return (
    <g>
      <Tramo dest={celda.desde.dir} />
      <circle cx={CENTRO_CELDA} cy={CENTRO_CELDA} r={ANCHO_CELDA / 10} />
    </g>
  );
}

Paragolpe.propTypes = {
  celda: paragolpeShape,
};
