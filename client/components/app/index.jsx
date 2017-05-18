import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import initStore from '_utils/initStore';
import { selSector, selUserName } from '_store/selectors';
import { login, logout, getUserData } from '_store/actions';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Mimico from '_components/mimico';
import Menu from '_components/menu';
import Login from '_components/login';

import Errors from '_components/errors';

import bindHandlers from '_utils/bindHandlers';
import styles from './styles.css';

export class AppComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      teletipo: false,
      menu: false,
    };
    bindHandlers(this);
  }
  onToggleTeletipoHandler() {
    this.setState({ teletipo: !this.state.teletipo });
  }
  onToggleMenuHandler() {
    this.setState({ menu: !this.state.menu });
  }
  render() {
    const { username = '', sector } = this.props;
    const descr = sector && sector.descr;
    const title = descr ? `CTC - ${descr}` : 'CTC';
    return (
      <div>
        <Errors />
        <Route path="/login" component={Login} />
        {username &&
          <div>
            <AppBar
              title={title}
              leftIcon="menu"
              onLeftIconClick={this.onToggleMenuHandler}
              rightIcon="message"
              onRightIconClick={this.onToggleTeletipoHandler}
            >
              <FontIcon value="person" /> {username}
            </AppBar>
            <div className={this.state.teletipo ? styles.contentWithDrawerOpen : ''}>
              <Layout>
                <NavDrawer active={this.state.menu} onOverlayClick={this.onToggleMenuHandler}>
                  <Menu onClose={this.onToggleMenuHandler} />
                </NavDrawer>
                <Panel>
                  <Route path="/sector/:idSector" component={Mimico} />
                </Panel>
              </Layout>
            </div>
            <div
              className={this.state.teletipo ? styles.bottomDrawerOpen : styles.bottomDrawerClosed}
            >
              <Teletipo />
            </div>
          </div>}
      </div>
    );
  }
}

AppComponent.propTypes = {
  sector: PropTypes.shape({
    descr: PropTypes.string,
  }),
  username: PropTypes.string,
};

export const storeInitializer = (dispatch, getState, { location, history }) => {
  if (matchPath(location.pathname, { path: '/logout' })) {
    return dispatch(logout()).then(() => history.replace('/'));
  }
  if (!matchPath(location.pathname, { path: '/login' })) {
    const storeUsername = selUserName(getState());
    const storageUsername = parseInt(localStorage.getItem('lastAccess'), 10) + SESSION_TIMEOUT <
      Date.now()
      ? ''
      : localStorage.getItem('username');
    if (storeUsername) {
      if (storageUsername) {
        if (storeUsername === storageUsername) {
          return true;
        }
        return dispatch(getUserData(storageUsername));
      }
      return dispatch(login('guest', 'guest'));
    } else if (storageUsername) {
      return dispatch(getUserData(storageUsername));
    }
    return dispatch(login('guest', 'guest'));
  }
  return true;
};

export const mapStateToProps = (state, { location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  const username = selUserName(state);
  return {
    username,
    sector: match && username && selSector(state, match.params.idSector),
  };
};

// prettier-ignore
export default compose(
  withRouter,
  initStore(storeInitializer),
  connect(mapStateToProps)
)(AppComponent);
