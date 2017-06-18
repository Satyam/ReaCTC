import { connect } from 'react-redux';

import { clickCelda } from '_store/actions';

import { selCelda, selEstado } from '_store/selectors';

import isPlainClick from '_utils/isPlainClick';

import CeldaComponent from '_components/celda';

export const mapStateToProps = (state, { idSector, coords }) => ({
  celda: selCelda(state, idSector, coords),
  estado: selEstado(state),
});

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onClick: tipo => ev => isPlainClick(ev) && dispatch(clickCelda(idSector, coords, tipo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CeldaComponent);
