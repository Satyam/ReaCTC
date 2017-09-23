import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from 'react-toolbox/lib/layout';

import Cambio from '_containers/estado/cambio';
import Triple from '_containers/estado/triple';
import Senal from '_containers/estado/senal';

export default function EstadoComponent({ tipo, idCelda, idSenal, onClose }) {
  if (!tipo) return null;
  const Content = { cambio: Cambio, triple: Triple, senal: Senal }[tipo];
  if (!Content) return null;
  return (
    <Sidebar active={!!tipo} onOverlayClick={onClose}>
      <Content idCelda={idCelda} idSenal={idSenal} />
    </Sidebar>
  );
}

EstadoComponent.propTypes = {
  tipo: PropTypes.string,
  idCelda: PropTypes.string,
  idSenal: PropTypes.string,
  onClose: PropTypes.func,
};
