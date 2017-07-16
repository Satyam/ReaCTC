import React from 'react';
import { lineaShape } from '_components/shapes';

import Tramo from './tramo';

export default function Linea({ celda }) {
  return (
    <g>
      <Tramo dest={celda.desde.dir} />
      <Tramo dest={celda.hacia.dir} />
    </g>
  );
}

Linea.propTypes = {
  celda: lineaShape,
};
