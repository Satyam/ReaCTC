import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import CambioComponent, { DESVIADO, NORMAL } from './cambioComponent';

export const mapStateToProps = (state, { idSector, coords }) => selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetCambioNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, NORMAL)),
  onSetCambioDesviado: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, DESVIADO)),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CambioComponent);
