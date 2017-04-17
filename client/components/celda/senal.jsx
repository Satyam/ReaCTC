import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import isPlainClick from '_utils/isPlainClick';

import { selSenal } from '_store/selectors';

import { clickSenal } from '_store/actions';

import { CENTRO_CELDA, ANG } from './common';
import styles from './styles.css';

export function SenalComponent({ dir, luces, onClick }) {
  /*
  Todos estos calculos son a ojo, lo cual hace bastante irrelevante las
  constances como ANCHO_CELDA y demas porque deberían hacerse proporcional
  y ajustarse segun se quiera
  */
  const r = 5;
  const y = 38;
  const xTope = 95;
  /* eslint-disable no-mixed-operators */
  const x1 = xTope - 2 * r;
  const x2 = x1 + 2 - 2 * r;
  /* eslint-enable no-mixed-operators */

  return (
    <g
      className={styles.senal}
      transform={`rotate(${ANG[dir]}, ${CENTRO_CELDA}, ${CENTRO_CELDA})`}
      onClick={onClick}
    >
      <line x1={xTope} y1={y} x2={x2 + r} y2={y} />
      <line x1={xTope} y1={y - r} x2={xTope} y2={y + r} />
      <circle
        className={classNames(styles.primaria, styles[luces.primaria.estado])}
        cx={luces.izq || luces.der ? x2 : x1}
        cy={y}
        r={r}
      />
      {luces.izq &&
        <circle
          className={classNames(styles.izq, styles[luces.izq.estado])}
          cx={x1}
          cy={y + r}
          r={r}
        />}
      {luces.der &&
        <circle
          className={classNames(styles.der, styles[luces.der.estado])}
          cx={x1}
          cy={y - r}
          r={r}
        />}
    </g>
  );
}

SenalComponent.propTypes = {
  // <Senal dir={dir} luces={senal} key={dir}/>
  dir: PropTypes.string.isRequired,
  luces: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords, dir }) =>
  selSenal(state, idSector, coords, dir);

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onclick: ev => isPlainClick(ev) && dispatch(clickSenal(idSector, coords, dir)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SenalComponent);
