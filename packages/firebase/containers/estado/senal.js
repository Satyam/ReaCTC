import { connect } from 'react-redux';
import { firebaseConnect } from 'firebase-connect';
import { compose } from 'recompose';

import { setLuzEstado, setLuzManual } from '_store/actions';

import Senal from '_components/estado/senal';

export const firebaseDataMap = ({ idSenal }) => ({
  $: `senales/${idSenal}`,
});

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onSetEstado: (luz, estado) => dispatch(setLuzEstado(idSector, coords, dir, luz, estado)),
  onSetManual: (luz, manual) => dispatch(setLuzManual(idSector, coords, dir, luz, manual)),
});

export default compose(firebaseConnect(firebaseDataMap), connect(null, mapDispatchToProps))(Senal);
