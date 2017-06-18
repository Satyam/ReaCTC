import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { login } from '_store/actions';
import { selUsername } from '_store/selectors';

import LoginComponent from '_components/login';

export const mapStateToProps = state => ({ username: selUsername(state) });

export const mapDispatchToProps = (dispatch, { history }) => ({
  onLogin: (username, password, signup) =>
    dispatch(login(username, password, signup)).then(() => history.replace('/')),
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(LoginComponent);
