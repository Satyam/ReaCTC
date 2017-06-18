import { connect } from 'react-redux';

import isPlainClick from '_utils/isPlainClick';

import { selSenal } from '_store/selectors';

import { clickSenal } from '_store/actions';

import Senal from '_components/senal';

export const mapStateToProps = (state, { idSector, coords, dir }) =>
  selSenal(state, idSector, coords, dir);

export const mapDispatchToProps = (dispatch, { idSector, coords, dir }) => ({
  onClick: ev => isPlainClick(ev) && dispatch(clickSenal(idSector, coords, dir)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Senal);
