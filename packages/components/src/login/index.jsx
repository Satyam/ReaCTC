import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

import { isPlainClick } from 'ctc-utils';

import styles from './styles.css';

export default class LoginComponent extends Component {
  constructor(props, context) {
    super(props, context);
    const username = props.username;
    this.state = {
      username: username && username !== 'guest' ? username : '',
      password: '',
      confirmation: '',
      signup: props.location.search === '?newUser',
    };
  }
  onChangeHandler = (value, ev) => {
    this.setState({ [ev.target.name]: value, fail: false });
  };
  onToggleSignupHandler = (ev) => {
    if (isPlainClick(ev)) {
      this.setState({ signup: !this.state.signup });
    }
  };
  onSubmitHandler = (ev) => {
    if (isPlainClick(ev)) {
      const { username, password, confirmation, signup } = this.state;
      if (signup && password !== confirmation) {
        this.setState({ fail: true });
        return;
      }
      this.setState({ password: '' });
      this.props.onLogin(username, password, signup);
    }
  };

  render() {
    const { username, password, confirmation, fail, signup } = this.state;
    return (
      <div className={styles.form}>
        <Helmet>
          <title>Login</title>
        </Helmet>
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
        <Button raised primary onClick={this.onSubmitHandler}>
          {signup ? 'Sign Up' : 'Login'}
        </Button>
        <Button className={styles.right} raised onClick={this.onToggleSignupHandler}>
          Switch to {signup ? 'login' : 'sign Up'}
        </Button>
      </div>
    );
  }
}

LoginComponent.propTypes = {
  username: PropTypes.string,
  onLogin: PropTypes.func,
  location: PropTypes.shape({ search: PropTypes.string }),
};
