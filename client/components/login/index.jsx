import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

import bindHandlers from '_utils/bindHandlers';
import isPlainClick from '_utils/isPlainClick';

import { login } from '_store/actions';
import { selUserName } from '_store/selectors';

import styles from './styles.css';

const signupRexp = /\wsignup\w/i;

export class LoginComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: props.username || '',
      password: '',
      confirmation: '',
      signup: signupRexp.test(props.location.pathname),
    };
    bindHandlers(this);
  }
  onChangeHandler(value, ev) {
    this.setState({ [ev.target.name]: value, fail: false });
  }
  onToggleSignupHandler(ev) {
    if (isPlainClick(ev)) {
      this.setState({ signup: !this.state.signup });
    }
  }
  onSubmitHandler(ev) {
    if (isPlainClick(ev)) {
      const { username, password, confirmation, signup } = this.state;
      if (signup && password !== confirmation) {
        this.setState({ fail: true });
        return;
      }
      this.props.onLogin(username, password, signup);
    }
  }

  render() {
    const { username, password, confirmation, fail, signup } = this.state;
    return (
      <div className={styles.form}>
        <Input
          type="text"
          label="User Name"
          name="username"
          value={username}
          onChange={this.onChangeHandler}
        />
        <Input
          type="password"
          label="Password"
          name="password"
          value={password}
          onChange={this.onChangeHandler}
        />
        {signup
          ? <Input
            type="password"
            label="Confirm Password"
            name="confirmation"
            value={confirmation}
            onChange={this.onChangeHandler}
            error={fail ? 'passwords do not match' : null}
          />
          : null}
        <Button raised primary onClick={this.onSubmitHandler}>Login</Button>
        <Button className={styles.right} raised onClick={this.onToggleSignupHandler}>{signup ? 'Login' : 'Sign Up'}</Button>
      </div>
    );
  }
}

LoginComponent.propTypes = {
  username: PropTypes.string,
  onLogin: PropTypes.func,
  location: PropTypes.object,
};

export const mapStateToProps = state => ({ username: selUserName(state) });

export const mapDispatchToProps = dispatch => ({
  onLogin: (username, password, signup) => dispatch(login(username, password, signup)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
