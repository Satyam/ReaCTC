import { connect } from 'react-redux';

import { setLuzEstado, setLuzManual } from '_store/actions';

import { selSenal } from '_store/selectors';

import Senal from '_components/estado/senal';

export const mapStateToProps = (state, { idSenal }) => selSenal(state, idSenal);

export const mapDispatchToProps = (dispatch, { idSenal }) => ({
  onSetEstado: (luz, estado) => dispatch(setLuzEstado(idSenal, luz, estado)),
  onSetManual: (luz, manual) => dispatch(setLuzManual(idSenal, luz, manual)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Senal);
