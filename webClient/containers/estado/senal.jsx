import { connect } from 'react-redux';

import { setLuzEstado, setLuzManual } from '_store/actions';

import { selSenal } from '_store/selectors';

import SenalComponent from '_components/estado/senal';

export const mapStateToProps = (state, { idSector, coords, dir }) =>
  selSenal(state, idSector, coords, dir);

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onSetEstado: (luz, estado) => dispatch(setLuzEstado(idSector, coords, dir, luz, estado)),
  onSetManual: (luz, manual) => dispatch(setLuzManual(idSector, coords, dir, luz, manual)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SenalComponent);
