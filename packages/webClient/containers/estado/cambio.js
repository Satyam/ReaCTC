import { connect } from 'react-redux';

import { isPlainClick } from 'ctc-utils';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import Cambio, { DESVIADO, NORMAL } from '_components/estado/cambio';

export const mapStateToProps = (state, { idCelda }) => selCelda(state, idCelda);

export const mapDispatchToProps = (dispatch, { idCelda }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, NORMAL)),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idCelda, DESVIADO)),
  onSetManual: value => dispatch(setCambioManual(idCelda, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cambio);
