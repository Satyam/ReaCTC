import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';

import isPlainClick from '_utils/isPlainClick';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { Container, Row, Col } from 'react-grid-system';

import { setLuzEstado, setLuzManual } from '_store/actions';

import { selSenal } from '_store/selectors';

import styles from './styles.css';

export function LuzComponent({
  manual,
  estado,
  onBoundSetManual,
  onSetAlto,
  onSetPrecaucion,
  onSetLibre,
}) {
  return (
    <div>
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'alto'}
        className={styles.alto}
        onClick={onSetAlto}
      />
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'precaucion'}
        className={styles.precaucion}
        onClick={onSetPrecaucion}
      />
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'libre'}
        className={styles.libre}
        onClick={onSetLibre}
      />
      <Switch label="Manual" checked={manual} onChange={onBoundSetManual} />
    </div>
  );
}

LuzComponent.propTypes = {
  manual: PropTypes.bool,
  estado: PropTypes.string,
  onBoundSetManual: PropTypes.func,
  onSetAlto: PropTypes.func,
  onSetPrecaucion: PropTypes.func,
  onSetLibre: PropTypes.func,
};

export const Luz = withHandlers({
  onBoundSetManual: props => value => props.onSetManual(props.luz, value),
  onSetAlto: props => ev => isPlainClick(ev) && props.onSetEstado(props.luz, 'alto'),
  onSetPrecaucion: props => ev => isPlainClick(ev) && props.onSetEstado(props.luz, 'precaucion'),
  onSetLibre: props => ev => isPlainClick(ev) && props.onSetEstado(props.luz, 'libre'),
})(LuzComponent);

export function SenalComponent({ coords, dir, izq, primaria, der, onSetEstado, onSetManual }) {
  return (
    <Container>
      <Row className={styles.rowSpacing}>
        <Col md={4} className={styles.label}>Señal</Col>
        <Col md={4}>{coords}</Col>
        <Col md={4}>{dir}</Col>
      </Row>
      <Row className={styles.rowSpacing}>
        <Col md={4}>
          {izq
            ? <Luz
              luz="izq"
              manual={izq.manual}
              estado={izq.estado}
              onSetManual={onSetManual}
              onSetEstado={onSetEstado}
            />
            : <div className={styles.noSenal} />}
        </Col>
        <Col md={4}>
          {primaria
            ? <Luz
              luz="primaria"
              manual={primaria.manual}
              estado={primaria.estado}
              onSetManual={onSetManual}
              onSetEstado={onSetEstado}
            />
            : <div className={styles.noSenal} />}
        </Col>
        <Col md={4}>
          {der
            ? <Luz
              luz="der"
              manual={der.manual}
              estado={der.estado}
              onSetManual={onSetManual}
              onSetEstado={onSetEstado}
            />
            : <div className={styles.noSenal} />}
        </Col>
      </Row>
    </Container>
  );
}

SenalComponent.propTypes = {
  coords: PropTypes.string,
  dir: PropTypes.string,
  primaria: PropTypes.object,
  izq: PropTypes.object,
  der: PropTypes.object,
  onSetEstado: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords, dir }) =>
  selSenal(state, idSector, coords, dir);

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onSetEstado: (luz, estado) => dispatch(setLuzEstado(idSector, coords, dir, luz, estado)),
  onSetManual: (luz, manual) => dispatch(setLuzManual(idSector, coords, dir, luz, manual)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SenalComponent);
