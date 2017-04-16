import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Layout, Panel } from 'react-toolbox/lib/layout';

import { ANCHO_CELDA } from '_components/celda/common';

import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import Celda from '_components/celda';
import Estado from '_components/estado';

import { sectorSelector } from '_store/selectors';

import styles from './styles.css';

export function SectorComponent({ idSector, ancho, alto, celdas }) {
  return (
    <Layout className={styles.sector}>
      <Panel>
        {isEmpty(ancho) // Any property would do just as well
          ? <img alt="loading..." className={styles.loading} src="/loading.gif" />
          : <svg viewBox={`0 0 ${ancho * ANCHO_CELDA} ${alto * ANCHO_CELDA}`}>
            {map(celdas, (celda, coords) => (
              <Celda key={coords} coords={coords} celda={celda} idSector={idSector} />
              ))}
          </svg>}
      </Panel>
      <Estado idSector={idSector} />
    </Layout>
  );
}
SectorComponent.propTypes = {
  idSector: PropTypes.string,
  ancho: PropTypes.number,
  alto: PropTypes.number,
  celdas: PropTypes.object,
};

export const mapStateToProps = (state, { idSector }) => sectorSelector.item(state, idSector);

export default connect(mapStateToProps)(SectorComponent);
