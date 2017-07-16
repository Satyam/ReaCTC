import React from 'react';
import { cambioShape } from '_components/shapes';
import map from 'lodash/map';

import Tramo from './tramo';

export default function Cambio({ celda }) {
  return (
    <g>
      <Tramo key="punta" dest={celda.punta.dir} />
      {map(celda.ramas, (rama, nombre) =>
        (<Tramo
          key={nombre}
          dest={rama.dir}
          estilo={celda.posicion === nombre ? 'tramo-normal' : 'tramo-muerto'}
        />)
      )}
    </g>
  );
}

Cambio.propTypes = {
  celda: cambioShape,
};
