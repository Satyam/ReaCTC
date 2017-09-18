import { connect } from 'react-redux';
import firebaseConnect from '_utils/firebase/connect';
import { compose } from 'recompose';

import isPlainClick from '_utils/isPlainClick';

import Celda from '_components/celda';

import { clickCelda } from '_store/actions';
import { selEstado } from '_store/selectors';

export const firebaseDataMap = ({ idCelda }) => ({
  celda: `celdas/${idCelda}`,
});

export const mapStateToProps = state => ({
  estado: selEstado(state),
});

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onClick: tipo => ev => isPlainClick(ev) && dispatch(clickCelda(idCelda, tipo)),
});

export default compose(
  firebaseConnect(firebaseDataMap),
  connect(mapStateToProps, mapDispatchToProps)
)(Celda);
