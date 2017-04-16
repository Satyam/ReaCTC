import React from 'react';
import PropTypes from 'prop-types';

import Tramo from './tramo';
import { DIR } from './common';

export default function Cruce({ celda }) {
  return (<g>
    <Tramo dest={celda.l1.desde.dir} />
    <Tramo dest={celda.l1.hacia.dir} />
    <Tramo dest={celda.l2.desde.dir} />
    <Tramo dest={celda.l2.hacia.dir} />
  </g>);
}

Cruce.propTypes = {
  celda: PropTypes.shape({
    l1: PropTypes.shape({
      desde: PropTypes.shape({
        dir: PropTypes.oneOf(DIR),
      }),
      hacia: PropTypes.shape({
        dir: PropTypes.oneOf(DIR),
      }),
    }),
    l2: PropTypes.shape({
      desde: PropTypes.shape({
        dir: PropTypes.oneOf(DIR),
      }),
      hacia: PropTypes.shape({
        dir: PropTypes.oneOf(DIR),
      }),
    }),
  }),
};
