import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import map from 'lodash/map';

import {
  clickCelda,
} from '_store/actions';

import {
  celdaSelector,
} from '_store/selectors';

import isPlainClick from '_utils/isPlainClick';
import splitCoords from '_utils/splitCoords';

import Senal from './senal';

import { ANCHO_CELDA } from './common';
import styles from './styles.css';

import Linea from './linea';
import Cambio from './cambio';
import Paragolpe from './paragolpe';
import Cruce from './cruce';
import Triple from './triple';

const renderers = {
  linea: Linea,
  cambio: Cambio,
  paragolpe: Paragolpe,
  cruce: Cruce,
  triple: Triple,
};

export function CeldaComponent({ coords, celda, idSector, onClick }) {
  const [x, y] = splitCoords(coords);
  const label = celda.descr || `[${x},${y}]`;
  const Renderer = renderers[celda.tipo];

  return (
    <g
      transform={`translate(${x * ANCHO_CELDA}, ${y * ANCHO_CELDA})`}
      onClick={onClick}
    >
      <rect
        x="0"
        y="0"
        width={ANCHO_CELDA}
        height={ANCHO_CELDA}
        className={classNames(styles.rect, celda.manual && styles.manual)}
      />
      <Renderer celda={celda} />
      <text
        className={styles.text}
        x="5"
        y="95"
      >{label}</text>
      {map(celda.senales, (senal, dir) => (<Senal
        dir={dir}
        luces={senal}
        coords={celda.coords}
        idSector={idSector}
        key={dir}
      />))}
    </g>
  );
}

CeldaComponent.propTypes = {
  // <Celda key={coords} coords={coords} celda={celda} nombreSector={sector.nombre}/>
  coords: PropTypes.string.isRequired,
  celda: PropTypes.shape({
    tipo: PropTypes.string.isRequired,
  }),
  idSector: PropTypes.string,
  onClick: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) =>
  celdaSelector.item(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onclick: ev => isPlainClick(ev) && dispatch(clickCelda(idSector, coords)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CeldaComponent);
