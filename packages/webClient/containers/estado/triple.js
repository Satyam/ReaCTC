import { connect } from 'react-redux';

import { isPlainClick } from 'ctc-utils';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import Triple, { IZQ, CENTRO, DER } from '_components/estado/triple';

export const mapStateToProps = (state, { idCelda }) => selCelda(state, idCelda);

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onSetNormal: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, CENTRO)),
  onSetIzq: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, IZQ)),
  onSetDer: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, DER)),
  onSetManual: value => dispatch(setCambioManual(idCelda, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Triple);
