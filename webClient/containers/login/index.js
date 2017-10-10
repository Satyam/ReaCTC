import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { login } from '_store/actions';
import { selUsername } from '_store/selectors';

import Login from '_components/login';

export const mapStateToProps = state => ({ username: selUsername(state) });

export const mapDispatchToProps = (dispatch, { history }) => ({
  onLogin: async (username, password, signup) => {
    await dispatch(login(username, password, signup));
    await history.replace('/');
  },
});

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Login);
