import React from 'react';
import PropTypes from 'prop-types';
import { withHandlers } from 'recompose';
import classNames from 'classnames';

import { isPlainClick } from 'ctc-utils';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { Container, Row, Col } from 'react-grid-system';

import styles from './styles.css';

export function EstadoLuzComponent({
  luz,
  manual,
  estado,
  onBoundSetManual,
  onSetAlto,
  onSetPrecaucion,
  onSetLibre,
}) {
  return (
    <div className={classNames({ [styles.pushDown]: luz !== 'primaria' })}>
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'alto'}
        className={classNames(styles.alto, styles.centered)}
        onClick={onSetAlto}
      />
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'precaucion'}
        className={classNames(styles.precaucion, styles.centered)}
        onClick={onSetPrecaucion}
      />
      <Button
        floating
        mini
        icon="lens"
        disabled={estado === 'libre'}
        className={classNames(styles.libre, styles.centered)}
        onClick={onSetLibre}
      />
      <Switch label="Manual" checked={manual} onChange={onBoundSetManual} />
    </div>
  );
}

EstadoLuzComponent.propTypes = {
  luz: PropTypes.string,
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
})(EstadoLuzComponent);

export default function EstadoSenalComponent({
  coords,
  dir,
  izq,
  primaria,
  der,
  onSetEstado,
  onSetManual,
}) {
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

EstadoSenalComponent.propTypes = {
  coords: PropTypes.string,
  dir: PropTypes.string,
  primaria: PropTypes.shape({
    estado: PropTypes.string,
  }),
  izq: PropTypes.shape({
    estado: PropTypes.string,
  }),
  der: PropTypes.shape({
    estado: PropTypes.string,
  }),
  onSetEstado: PropTypes.func,
  onSetManual: PropTypes.func,
};
