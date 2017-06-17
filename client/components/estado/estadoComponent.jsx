import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from 'react-toolbox/lib/layout';

import Cambio from './cambio';
import Triple from './triple';
import Senal from './senal';

export default function EstadoComponent({ tipo, idSector, coords, dir, onClose }) {
  if (!tipo) return null;
  const Content = { cambio: Cambio, triple: Triple, senal: Senal }[tipo];
  if (!Content) return null;
  return (
    <Sidebar active={!!tipo} onOverlayClick={onClose}>
      <Content idSector={idSector} coords={coords} dir={dir} />
    </Sidebar>
  );
}

EstadoComponent.propTypes = {
  tipo: PropTypes.string,
  idSector: PropTypes.string,
  coords: PropTypes.string,
  dir: PropTypes.string,
  onClose: PropTypes.func,
};
