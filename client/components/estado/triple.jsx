import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';

import { setCambio, setCambioManual } from '_store/actions';

import { selCelda } from '_store/selectors';

import TripleComponent, { IZQ, CENTRO, DER } from './tripleComponent';

export const mapStateToProps = (state, { idSector, coords }) => selCelda(state, idSector, coords);

export const mapDispatchToProps = (dispatch, { idSector, coords }) => ({
  onSetNormal: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, CENTRO)),
  onSetIzq: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, IZQ)),
  onSetDer: ev => isPlainClick(ev) && dispatch(setCambio(idSector, coords, DER)),
  onSetManual: value => dispatch(setCambioManual(idSector, coords, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TripleComponent);
