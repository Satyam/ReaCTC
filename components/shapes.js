import PropTypes from 'prop-types';
import { DIR } from './common';

function merge(base, other) {
  return Object.assign({}, base, other);
}

export const tramoShape = PropTypes.shape({
  dir: PropTypes.oneOf(DIR).isRequired,
}).isRequired;

export const sectorType = {
  idSector: PropTypes.string.isRequired,
  alto: PropTypes.number.isRequired,
  ancho: PropTypes.number.isRequired,
  celdas: PropTypes.arrayOf(PropTypes.string),
  descrCorta: PropTypes.string,
  descr: PropTypes.string,
};

export const sectorShape = PropTypes.shape(sectorType);

export const sectoresShape = PropTypes.objectOf(sectorShape);

export const celdaType = {
  coords: PropTypes.string.isRequired,
  tipo: PropTypes.oneOf(['linea', 'cambio', 'triple', 'paragolpe', 'cruce']).isRequired,
  manual: PropTypes.bool,
  enclavamientos: PropTypes.arrayOf(PropTypes.string),
  senales: PropTypes.arrayOf(PropTypes.string),
};

export const celdaShape = PropTypes.shape(celdaType);

export const celdasShape = PropTypes.objectOf(celdaShape);

export const cambioType = merge(celdaType, {
  punta: tramoShape,
  ramas: PropTypes.shape({
    normal: tramoShape,
    desviado: tramoShape,
  }).isRequired,
  posicion: PropTypes.oneOf(['normal', 'desviado']),
});

export const cambioShape = PropTypes.shape(cambioType);

export const tripleType = merge(celdaType, {
  punta: tramoShape,
  ramas: PropTypes.shape({
    izq: tramoShape,
    centro: tramoShape,
    der: tramoShape,
  }).isRequired,
  posicion: PropTypes.oneOf(['izq', 'centro', 'der']),
});

export const tripleShape = PropTypes.shape(tripleType);

export const cruceType = merge(celdaType, {
  l1: PropTypes.shape({
    desde: tramoShape,
    hacia: tramoShape,
    nivel: PropTypes.number,
  }).isRequired,
  l2: PropTypes.shape({
    desde: tramoShape,
    hacia: tramoShape,
    nivel: PropTypes.number,
  }).isRequired,
});

export const cruceShape = PropTypes.shape(cruceType);

export const paragolpeType = merge(celdaType, {
  desde: tramoShape,
});

export const paragolpeShape = PropTypes.shape(paragolpeType);

export const lineaType = merge(celdaType, {
  desde: tramoShape,
  hacia: tramoShape,
});

export const lineaShape = PropTypes.shape(lineaType);

export const luzType = {
  estado: PropTypes.oneOf(['libre', 'precaucion', 'alto']),
};

export const luzShape = PropTypes.shape(luzType);

export const senalType = {
  dir: PropTypes.oneOf(DIR).isRequired,
  izq: luzShape,
  primaria: luzShape,
  der: luzShape,
  manual: PropTypes.bool,
};

export const senalShape = PropTypes.shape(senalType);

export const senalesShape = PropTypes.objectOf(senalShape);

export const enclavamientoType = {
  tipo: PropTypes.oneOf(['apareados', 'senalCambio']).isRequired,
};

export const enclavamientoShape = PropTypes.shape(enclavamientoType);

export const enclavamientosShape = PropTypes.objectOf(enclavamientoShape);

export const apareadosType = merge(enclavamientoType, {
  celda: PropTypes.string.isRequired,
});

export const apareadosShape = PropTypes.shape(apareadosType);

export const cambioSenalType = merge(enclavamientoType, {
  senal: PropTypes.string.isRequired,
});

export const cambioSenalShape = PropTypes.shape(cambioSenalType);

export default {
  sectores: sectoresShape,
  celdas: celdasShape,
  enclavamientos: enclavamientosShape,
  senales: senalesShape,
};
