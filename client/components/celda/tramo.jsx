import React from 'react';
import PropTypes from 'prop-types';

import { CENTRO_CELDA, X, Y } from './common';
import styles from './styles.css';

export default function Tramo({ dest, estilo = 'tramo-normal' }) {
  return (<line
    x1={CENTRO_CELDA}
    y1={CENTRO_CELDA}
    x2={X[dest]}
    y2={Y[dest]}
    className={styles[estilo]}
  />);
}

Tramo.propTypes = {
  dest: PropTypes.string.isRequired,
  estilo: PropTypes.string,
};
