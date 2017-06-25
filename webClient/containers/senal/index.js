import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';

import { selSenal } from '_store/selectors';

import { clickSenal } from '_store/actions';

import Senal from '_components/senal';

export const mapStateToProps = (state, { idSenal }) => selSenal(state, idSenal);

export const mapDispatchToProps = (dispatch, { idSenal }) => ({
  onClick: ev => isPlainClick(ev) && dispatch(clickSenal(idSenal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Senal);
