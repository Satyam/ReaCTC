import { connect } from 'react-redux';
import firebaseConnect from '_utils/firebase/connect';
import { compose } from 'recompose';

import isPlainClick from '_utils/isPlainClick';

import { setCambio, setCambioManual } from '_store/actions';

import Triple, { IZQ, CENTRO, DER } from '_components/estado/triple';

export const firebaseDataMap = ({ idCelda }) => ({
  $: `celdas/${idCelda}`,
});

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onSetNormal: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, CENTRO)),
  onSetIzq: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, IZQ)),
  onSetDer: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, DER)),
  onSetManual: value => dispatch(setCambioManual(idCelda, value)),
});

export default compose(connect(null, mapDispatchToProps), firebaseConnect(firebaseDataMap))(Triple);
