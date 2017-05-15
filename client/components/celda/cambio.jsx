import React from 'react';
import PropTypes from 'prop-types';

import Tramo from './tramo';
import { DIR } from './common';

export default function Cambio({ celda }) {
  return (<g>
    <Tramo dest={celda.punta.dir} />
    <Tramo dest={celda.normal.dir} estilo={celda.desviado ? 'tramo-muerto' : 'tramo-normal'} />
    <Tramo dest={celda.invertido.dir} estilo={celda.desviado ? 'tramo-normal' : 'tramo-muerto'} />
  </g>);
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
    desviado: PropTypes.bool,
  }),
};
