import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { Container, Row, Col } from 'react-grid-system';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import styles from './styles.css';

export function CambioComponent({
  coords,
  desviado,
  manual,
  onSetCambioNormal,
  onSetCambioDesviado,
  onSetManual,
}) {
  // Eventualmente reemplazar iconos en botones por:
  // icon={<GithubIcon />}
  // const GithubIcon = () => (
  //   <svg viewBox="0 0 284 277">
  //     <g><path d="M141.888675,0.0234927555 ....  141.888675,0.0234927555" /></g>
  //   </svg>
  // );
  return (
    <Container>
      <Row className={styles.rowSpacing}>
        <Col md={6} className={styles.label}>Cambio</Col>
        <Col md={6} className={styles.label}>{coords}</Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col md={6}>
          <Button
            icon="arrow_upward"
            floating
            mini
            onClick={onSetCambioNormal}
            disabled={!desviado}
          />
        </Col>
        <Col md={6}>
          <Button
            icon="call_made"
            floating
            mini
            onClick={onSetCambioDesviado}
            disabled={desviado}
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
  desviado: PropTypes.bool,
  manual: PropTypes.bool,
  onSetCambioNormal: PropTypes.func,
  onSetCambioDesviado: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) => selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, false)),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, true)),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CambioComponent);
