import { connect } from 'react-redux';
import { firebaseConnect } from 'firebase-connect';
import { compose } from 'recompose';

import { isPlainClick } from 'ctc-utils';

import { setCambio, setCambioManual } from '_store/actions';

import Cambio, { DESVIADO, NORMAL } from '_components/estado/cambio';

export const firebaseDataMap = ({ idCelda }) => ({
  $: `celdas/${idCelda}`,
});

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, NORMAL)),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, DESVIADO)),
  onSetManual: value => dispatch(setCambioManual(idCelda, value)),
});

export default compose(connect(null, mapDispatchToProps), firebaseConnect(firebaseDataMap))(Cambio);
