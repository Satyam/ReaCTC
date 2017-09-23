import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { TripleIzq, TripleNormal, TripleDer } from '_components/icons';

import styles from './styles.css';

export const IZQ = 'izq';
export const CENTRO = 'centro';
export const DER = 'der';

export default function EstadoTripleComponent({
  coords,
  posicion,
  manual,
  onSetNormal,
  onSetIzq,
  onSetDer,
  onSetManual,
}) {
  return (
    <Container>
      <Row className={styles.rowSpacing}>
        <Col md={6} className={styles.label}>Triple</Col>
        <Col md={6} className={styles.label}>{coords}</Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col md={4}>
          <Button
            icon={<TripleIzq />}
            floating
            mini
            onClick={onSetIzq}
            disabled={posicion === IZQ}
          />
        </Col>
        <Col md={4}>
          <Button
            icon={<TripleNormal />}
            floating
            mini
            onClick={onSetNormal}
            disabled={posicion === CENTRO}
          />
        </Col>
        <Col md={4}>
          <Button
            icon={<TripleDer />}
            floating
            mini
            onClick={onSetDer}
            disabled={posicion === DER}
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

EstadoTripleComponent.propTypes = {
  coords: PropTypes.string,
  posicion: PropTypes.string,
  manual: PropTypes.bool,
  onSetNormal: PropTypes.func,
  onSetIzq: PropTypes.func,
  onSetDer: PropTypes.func,
  onSetManual: PropTypes.func,
};
