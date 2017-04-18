import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Sector from '_components/sector';
import Errors from '_components/errors';

import bindHandlers from '_utils/bindHandlers';

import styles from './styles.css';
import Menu from './menu';
import ListaSectores from './listaSectores';

export default class Mimico extends Component {
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
    console.log('menu', !this.state.menu);
    this.setState({ menu: !this.state.menu });
  }
  render() {
    return (
      <div className="mimico">
        <Errors />
        <AppBar
          title="CTC"
          leftIcon="menu"
          onLeftIconClick={this.onToggleMenuHandler}
          rightIcon="message"
          onRightIconClick={this.onToggleTeletipoHandler}
        />
        <div className={this.state.teletipo ? styles.contentWithDrawerOpen : ''}>
          <Layout>
            <NavDrawer active={this.state.menu} onClick={this.onToggleMenuHandler}>
              <Menu />
            </NavDrawer>
            <Panel>
              <Route path="/:idSector" component={Sector} />
            </Panel>
          </Layout>

        </div>
        <div className={this.state.teletipo ? styles.bottomDrawerOpen : styles.bottomDrawerClosed}>
          <Teletipo />
        </div>
      </div>
    );
  }
}

Mimico.propTypes = {
  match: PropTypes.object,
};
