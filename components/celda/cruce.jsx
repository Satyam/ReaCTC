import React from 'react';
import { cruceShape } from '_components/shapes';

import Tramo from './tramo';

export default function Cruce({ celda }) {
  return (
    <g>
      <Tramo dest={celda.l1.desde.dir} />
      <Tramo dest={celda.l1.hacia.dir} />
      <Tramo dest={celda.l2.desde.dir} />
      <Tramo dest={celda.l2.hacia.dir} />
    </g>
  );
}

Cruce.propTypes = {
  celda: cruceShape,
};
