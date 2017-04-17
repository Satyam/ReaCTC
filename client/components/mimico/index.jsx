import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Sector from '_components/sector';
import Errors from '_components/errors';

import bindHandlers from '_utils/bindHandlers';

import Menu from './menu';
import ListaSectores from './listaSectores';

export default class Mimico extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      teletipo: false,
    };
    bindHandlers(this);
  }
  onToggelTeletipoHandler() {
    this.setState({ teletipo: !this.state.teletipo });
  }
  render() {
    return (
      <div className="mimico">
        <Errors />
        <AppBar
          title="CTC"
          leftIcon="menu"
          rightIcon="message"
          onRightIconClick={this.onToggelTeletipoHandler}
        >
          <Navigation>
            <ListaSectores />
          </Navigation>
        </AppBar>
        <Layout>
          <NavDrawer active={this.state.teletipo}>
            <Teletipo />
          </NavDrawer>
          <Panel>
            <Sector />
          </Panel>
        </Layout>
      </div>
    );
  }
}

Mimico.propTypes = {
  match: PropTypes.object,
};
