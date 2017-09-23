import { connect } from 'react-redux';
import { firebaseConnect } from 'firebase-connect';
import { compose } from 'recompose';

import { isPlainClick } from 'ctc-utils';

import { clickSenal } from '_store/actions';

import Senal from '_components/senal';

export const firebaseDataMap = ({ idSenal }) => ({
  senal: `senales/${idSenal}`,
});

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onClick: ev => isPlainClick(ev) && dispatch(clickSenal(idSector, coords, dir)),
});

export default compose(firebaseConnect(firebaseDataMap), connect(null, mapDispatchToProps))(Senal);
