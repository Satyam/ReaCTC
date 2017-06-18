import React from 'react';
import PropTypes from 'prop-types';

import Tramo from './tramo';
import { CENTRO_CELDA, ANCHO_CELDA, DIR } from '../common';

export default function Paragolpe({ celda }) {
  return (<g>
    <Tramo dest={celda.desde.dir} />
    <circle
      cx={CENTRO_CELDA}
      cy={CENTRO_CELDA}
      r={ANCHO_CELDA / 10}
    />
  </g>);
}

Paragolpe.propTypes = {
  celda: PropTypes.shape({
    desde: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
  }),
};
