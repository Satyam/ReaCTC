import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { CambioNormal, CambioDesviado } from '_components/icons';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import styles from './styles.css';

export function CambioComponent({
  coords,
  posicion,
  manual,
  onSetCambioNormal,
  onSetCambioDesviado,
  onSetManual,
}) {
  return (
    <Container>
      <Row className={styles.rowSpacing}>
        <Col md={6} className={styles.label}>Cambio</Col>
        <Col md={6} className={styles.label}>{coords}</Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col md={6}>
          <Button
            icon={<CambioNormal />}
            floating
            mini
            onClick={onSetCambioNormal}
            disabled={posicion === 'normal'}
          />
        </Col>
        <Col md={6}>
          <Button
            icon={<CambioDesviado />}
            floating
            mini
            onClick={onSetCambioDesviado}
            disabled={posicion === 'desviado'}
          />
        </Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col md={12}>
          <Switch label="Manual" checked={manual} onChange={onSetManual} />
        </Col>
      </Row>
    </Container>
  );
}

CambioComponent.propTypes = {
  coords: PropTypes.string,
  posicion: PropTypes.string,
  manual: PropTypes.bool,
  onSetCambioNormal: PropTypes.func,
  onSetCambioDesviado: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) => selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, 'normal')),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, 'desviado')),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CambioComponent);
