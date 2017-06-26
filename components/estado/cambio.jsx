import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { CambioNormal, CambioDesviado } from '_components/icons';

import styles from './styles.css';

export const DESVIADO = 'desviado';
export const NORMAL = 'normal';

export default function EstadoCambioComponent({
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
            disabled={posicion === NORMAL}
          />
        </Col>
        <Col md={6}>
          <Button
            icon={<CambioDesviado />}
            floating
            mini
            onClick={onSetCambioDesviado}
            disabled={posicion === DESVIADO}
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

EstadoCambioComponent.propTypes = {
  coords: PropTypes.string,
  posicion: PropTypes.string,
  manual: PropTypes.bool,
  onSetCambioNormal: PropTypes.func,
  onSetCambioDesviado: PropTypes.func,
  onSetManual: PropTypes.func,
};
