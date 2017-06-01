import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { TripleIzq, TripleNormal, TripleDer } from '_components/icons';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import styles from './styles.css';

export function CambioComponent({
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
            disabled={posicion === 'izq'}
          />
        </Col>
        <Col md={4}>
          <Button
            icon={<TripleNormal />}
            floating
            mini
            onClick={onSetNormal}
            disabled={posicion === 'centro'}
          />
        </Col>
        <Col md={4}>
          <Button
            icon={<TripleDer />}
            floating
            mini
            onClick={onSetDer}
            disabled={posicion === 'der'}
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
  onSetNormal: PropTypes.func,
  onSetIzq: PropTypes.func,
  onSetDer: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) => selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, 'centro')),
  onSetIzq: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, 'izq')),
  onSetDer: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, 'der')),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CambioComponent);
