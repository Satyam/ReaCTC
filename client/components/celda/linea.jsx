import React from 'react';
import PropTypes from 'prop-types';

import Tramo from './tramo';
import { DIR } from './common';

export default function Linea({ celda }) {
  return (<g>
    <Tramo dest={celda.desde.dir} />
    <Tramo dest={celda.hacia.dir} />
  </g>);
}

Linea.propTypes = {
  celda: PropTypes.shape({
    desde: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
    hacia: PropTypes.shape({
      dir: PropTypes.oneOf(DIR),
    }),
  }),
};
