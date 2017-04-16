import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import { Sidebar } from 'react-toolbox/lib/layout';

import { closeEstado } from '_store/actions';

import { estadoSelector } from '_store/selectors';

import Cambio from './cambio';
import Triple from './triple';
import Senal from './senal';

export function EstadoComponent({ tipo, idSector, coords, dir, onClose }) {
  if (!tipo) return null;
  const Content = { cambio: Cambio, triple: Triple, senal: Senal }[tipo];
  return (
    <Sidebar pinned={!!tipo}>
      <FontIcon value="close" onClick={onClose} />
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

export const mapStateToProps = state => estadoSelector.item(state);

export const mapDispatchToProps = dispatch => ({
  onClose: ev => isPlainClick(ev) && dispatch(closeEstado()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EstadoComponent);
