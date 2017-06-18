import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { FontIcon } from 'react-toolbox/lib/font_icon';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_containers/teletipo';
import Menu from '_containers/menu';

import Errors from '_containers/errors';

import loadModule from '_utils/moduleLoader';

import styles from './styles.css';

export default class AppComponent extends Component {
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
                  <Route path="/admin/sectores" component={loadModule('AdminSectores')} />
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
