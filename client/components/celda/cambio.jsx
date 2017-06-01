import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import Tramo from './tramo';
import { DIR } from './common';

export default function Cambio({ celda }) {
  return (
    <g>
      <Tramo key="punta" dest={celda.punta.dir} />
      {map(celda.ramas, (rama, nombre) => (
        <Tramo
          key={nombre}
          dest={rama.dir}
          estilo={celda.posicion === nombre ? 'tramo-normal' : 'tramo-muerto'}
        />
      ))}
    </g>
  );
}

Cambio.propTypes = {
  celda: PropTypes.shape({
    punta: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    normal: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    invertido: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    posicion: PropTypes.string,
  }),
};
