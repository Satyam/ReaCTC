import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';

import { closeEstado } from '_store/actions';

import { selEstado } from '_store/selectors';

import EstadoComponent from './estadoComponent';

export const mapStateToProps = state => selEstado(state);

export const mapDispatchToProps = dispatch => ({
  onClose: ev => isPlainClick(ev) && dispatch(closeEstado()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EstadoComponent);
