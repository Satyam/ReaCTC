import { connect } from 'react-redux';

import { isPlainClick } from 'ctc-utils';

import { closeEstado } from '_store/actions';

import { selEstado } from '_store/selectors';

import Estado from '_components/estado';

export const mapStateToProps = state => selEstado(state);

export const mapDispatchToProps = dispatch => ({
  onClose: ev => isPlainClick(ev) && dispatch(closeEstado()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Estado);
