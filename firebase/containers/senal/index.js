import { connect } from 'react-redux';
import firebaseConnect from '_utils/firebase/connect';
import { compose } from 'recompose';

import isPlainClick from '_utils/isPlainClick';

import { clickSenal } from '_store/actions';

import Senal from '_components/senal';

export const firebaseDataMap = ({ idSenal }) => ({
  $: `senales/${idSenal}`,
});

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onClick: ev => isPlainClick(ev) && dispatch(clickSenal(idSector, coords, dir)),
});

export default compose(firebaseConnect(firebaseDataMap), connect(null, mapDispatchToProps))(Senal);
