import React from 'react';
import PropTypes from 'prop-types';

import Tramo from './tramo';
import { DIR } from '../common';

export default function Cambio({ celda }) {
  return (
    <g>
      <Tramo dest={celda.punta.dir} />
      <Tramo dest={celda.centro.dir} estilo={celda.posicion ? 'tramo-muerto' : 'tramo-normal'} />
      <Tramo
        dest={celda.izq.dir}
        estilo={celda.posicion !== -1 ? 'tramo-muerto' : 'tramo-normal'}
      />
      <Tramo dest={celda.der.dir} estilo={celda.posicion !== 1 ? 'tramo-muerto' : 'tramo-normal'} />
    </g>
  );
}

Cambio.propTypes = {
  celda: PropTypes.shape({
    punta: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    centro: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    izq: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    der: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    posicion: PropTypes.number,
  }),
};
