import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { clickCelda } from '_store/actions';

import { selCelda, selEstado } from '_store/selectors';

import isPlainClick from '_utils/isPlainClick';
import splitCoords from '_utils/splitCoords';

import Senal from './senal';

import { ANCHO_CELDA } from './common';
import styles from './styles.css';

import Linea from './linea';
import Cambio from './cambio';
import Paragolpe from './paragolpe';
import Cruce from './cruce';

const renderers = {
  linea: Linea,
  cambio: Cambio,
  paragolpe: Paragolpe,
  cruce: Cruce,
  triple: Cambio,
};

export function CeldaComponent({ idSector, coords, celda, estado, onClick }) {
  const [x, y] = splitCoords(coords);
  const label = celda.descr || `[${x},${y}]`;
  const Renderer = renderers[celda.tipo];
  return (
    <g
      transform={`translate(${x * ANCHO_CELDA}, ${y * ANCHO_CELDA})`}
      onClick={onClick(celda.tipo)}
    >
      <rect
        x="0"
        y="0"
        width={ANCHO_CELDA}
        height={ANCHO_CELDA}
        className={classNames(styles.rect, {
          [styles.manual]: celda.manual,
          [styles.seleccionada]: estado.tipo &&
            idSector === estado.idSector &&
            coords === estado.coords,
        })}
      />
      <Renderer celda={celda} />
      <text className={styles.text} x="5" y="95">{label}</text>
      {celda.senales
        ? celda.senales.map((idSenal) => {
          const dir = idSenal.split(':')[2];
          return <Senal idSector={idSector} coords={coords} dir={dir} key={dir} />;
        })
        : null}
    </g>
  );
}

CeldaComponent.propTypes = {
  idSector: PropTypes.string.isRequired,
  coords: PropTypes.string.isRequired,
  celda: PropTypes.shape({
    tipo: PropTypes.string.isRequired,
    manual: PropTypes.bool,
  }),
  estado: PropTypes.shape({
    tipo: PropTypes.string,
    idSector: PropTypes.string,
    coords: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};

export const mapStateToProps = (state, { idSector, coords }) => ({
  celda: selCelda(state, idSector, coords),
  estado: selEstado(state),
});

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onClick: tipo => ev => isPlainClick(ev) && dispatch(clickCelda(idSector, coords, tipo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CeldaComponent);
