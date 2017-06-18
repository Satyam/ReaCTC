import { connect } from 'react-redux';

import { clearHttpErrors } from '_store/actions';
import { selErrors } from '_store/selectors';

import ErrorsComponent from '_components/errors';

export const mapStateToProps = state => ({
  errors: selErrors(state),
});

export const mapDispatchToProps = dispatch => ({
  onCloseErrors: () => dispatch(clearHttpErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorsComponent);
