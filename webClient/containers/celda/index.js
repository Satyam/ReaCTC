import { connect } from 'react-redux';

import { clickCelda } from '_store/actions';

import { selCelda, selEstado } from '_store/selectors';

import isPlainClick from '_utils/isPlainClick';

import Celda from '_components/celda';

export const mapStateToProps = (state, { idCelda }) => ({
  celda: selCelda(state, idCelda),
  estado: selEstado(state),
});

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onClick: tipo => ev => isPlainClick(ev) && dispatch(clickCelda(idCelda, tipo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Celda);
