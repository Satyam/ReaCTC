import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { setTriple, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import styles from './styles.css';

export function CambioComponent({
  posicion,
  manual,
  onSetNormal,
  onSetIzq,
  onSetDer,
  onSetManual,
}) {
  return (
    <Container>
      <Row>
        <Col md={3} className={styles.label}>Cambio</Col>
        <Col md={3}>
          <Button
            icon="arrow back"
            floating
            accent
            mini
            onClick={onSetIzq}
            disabled={posicion === -1}
          />
        </Col>
        <Col md={3}>
          <Button
            icon="arrow upward"
            floating
            accent
            mini
            onClick={onSetNormal}
            disabled={posicion === 0}
          />
        </Col>
        <Col md={3}>
          <Button
            icon="arrow forward"
            floating
            accent
            mini
            onClick={onSetDer}
            disabled={posicion === 1}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Switch label="Manual" checked={manual} onChange={onSetManual} />
        </Col>
      </Row>
    </Container>
  );
}

CambioComponent.propTypes = {
  posicion: PropTypes.number,
  manual: PropTypes.bool,
  onSetNormal: PropTypes.func,
  onSetIzq: PropTypes.func,
  onSetDer: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) =>
  selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetNormal: ev => isPlainClick(ev) && dispatch(setTriple(idSector, coords, 0)),
  onSetIzq: ev => isPlainClick(ev) && dispatch(setTriple(idSector, coords, -1)),
  onSetDer: ev => isPlainClick(ev) && dispatch(setTriple(idSector, coords, 1)),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CambioComponent);
