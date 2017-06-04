import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import initStore from '_utils/initStore';
import { selSector, selUsername } from '_store/selectors';
import { logout, ensureUser } from '_store/actions';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Menu from '_components/menu';

import Errors from '_components/errors';

import loadModule from '_utils/moduleLoader';

import styles from './styles.css';

export class AppComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      teletipo: false,
      menu: false,
    };
  }
  onToggleTeletipoHandler = () => {
    this.setState({ teletipo: !this.state.teletipo });
  };
  onToggleMenuHandler = () => {
    this.setState({ menu: !this.state.menu });
  };
  render() {
    const { username = '', sector } = this.props;
    const descr = sector && sector.descr;
    const title = descr ? `CTC - ${descr}` : 'CTC';
    return (
      <div>
        <Errors />
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
                  <Route path="/sector/:idSector" component={loadModule('Mimico')} />
                  <Route path="/login" component={loadModule('Login')} />
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
  return dispatch(ensureUser());
};

export const mapStateToProps = (state, { location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  const username = selUsername(state);
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
