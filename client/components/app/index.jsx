import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, matchPath } from 'react-router-dom';
import { compose } from 'recompose';

import { connect } from 'react-redux';

import { selSector } from '_store/selectors';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Mimico from '_components/mimico';
import Menu from '_components/menu';
import Login from '_components/login';

import Errors from '_components/errors';

import bindHandlers from '_utils/bindHandlers';
import styles from './styles.css';

export class MimicoComponent extends Component {
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
    const title = this.props.descr ? `CTC - ${this.props.descr}` : 'CTC';
    return (
      <div>
        <Errors />
        <AppBar
          title={title}
          leftIcon="menu"
          onLeftIconClick={this.onToggleMenuHandler}
          rightIcon="message"
          onRightIconClick={this.onToggleTeletipoHandler}
        />
        <div className={this.state.teletipo ? styles.contentWithDrawerOpen : ''}>
          <Layout>
            <NavDrawer active={this.state.menu} onOverlayClick={this.onToggleMenuHandler}>
              <Menu onClose={this.onToggleMenuHandler} />
            </NavDrawer>
            <Panel>
              <Route path="/sector/:idSector" component={Mimico} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Login} />
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

MimicoComponent.propTypes = {
  descr: PropTypes.string,
};

export const mapStateToProps = (state, { location }) => {
  const match = matchPath(location.pathname, { path: '/sector/:idSector' });
  return match ? selSector(state, match.params.idSector) : {};
};

export default compose(withRouter, connect(mapStateToProps))(MimicoComponent);
