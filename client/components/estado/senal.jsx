import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { Button } from 'react-toolbox/lib/button';
import { Switch } from 'react-toolbox/lib/switch';

import { setCambio, setCambioManual } from '_store/actions';

import { celdaSelector } from '_store/selectors';

import styles from './styles.css';

export function Luz({ manual, estado, onSetManual, onSetAlto, onSetPrecaucion, onSetLibre }) {
  return (
    <div>
      <Button
        floating
        accent
        mini
        icon="lens"
        disable={estado === 'alto'}
        className={styles.alto}
        onClick={onSetAlto}
      />
      <Button
        floating
        accent
        mini
        icon="lens"
        disable={estado === 'precaucion'}
        className={styles.precaucion}
        onClick={onSetPrecaucion}
      />
      <Button
        floating
        accent
        mini
        icon="lens"
        disable={estado === 'libre'}
        className={styles.libre}
        onClick={onSetLibre}
      />
      <Switch label="Manual" checked={manual} onChange={onSetManual} />
    </div>
  );
}

Luz.propTypes = {
  manual: PropTypes.bool,
  estado: PropTypes.string,
  onSetManual: PropTypes.func,
  onSetAlto: PropTypes.func,
  onSetPrecaucion: PropTypes.func,
  onSetLibre: PropTypes.func,
};

export function SenalComponent({}) {
  const izq = senal.izq;
  const pri = senal.primaria;
  const der = senal.der;
  return (
    <div>
      {izq
        ? <Luz
          manual={izq.manual}
          estado={izq.estado}
          onSetManual={q}
          onSetAlto={q}
          onSetPrecaucion={q}
          onSetLibre={q}
        />
        : <div className={styles.noSenal} />}
      {izq
        ? <Luz
          manual={pri.manual}
          estado={pri.estado}
          onSetManual={q}
          onSetAlto={q}
          onSetPrecaucion={q}
          onSetLibre={q}
        />
        : <div className={styles.noSenal} />}
      {izq
        ? <Luz
          manual={der.manual}
          estado={der.estado}
          onSetManual={q}
          onSetAlto={q}
          onSetPrecaucion={q}
          onSetLibre={q}
        />
        : <div className={styles.noSenal} />}
    </div>
  );
}

SenalComponent.propTypes = {
  desviado: PropTypes.bool,
  manual: PropTypes.bool,
  onSetCambioNormal: PropTypes.func,
  onSetCambioDesviado: PropTypes.func,
  onSetManual: PropTypes.func,
};

export const mapStateToProps = (state, { idSector, coords }) =>
  celdaSelector.item(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, false)),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, true)),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SenalComponent);
