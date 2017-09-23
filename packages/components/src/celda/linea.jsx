import React from 'react';
import { lineaShape } from '_components/shapes';

import Tramo from './tramo';

export default function Linea({ celda }: { celda: LineaType }) {
  return (
    <g>
      <Tramo dir={celda.desde.dir} />
      <Tramo dir={celda.hacia.dir} />
    </g>
  );
}

Linea.propTypes = {
  celda: lineaShape,
};
