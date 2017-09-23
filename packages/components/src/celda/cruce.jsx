// @flow
import React from 'react';
import { cruceShape } from '_components/shapes';

import Tramo from './tramo';

export default function Cruce({ celda }: { celda: CruceType }) {
  return (
    <g>
      <Tramo dir={celda.l1.desde.dir} />
      <Tramo dir={celda.l1.hacia.dir} />
      <Tramo dir={celda.l2.desde.dir} />
      <Tramo dir={celda.l2.hacia.dir} />
    </g>
  );
}

Cruce.propTypes = {
  celda: cruceShape,
};
