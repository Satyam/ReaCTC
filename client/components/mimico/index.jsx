import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Link } from 'react-router-dom';
import { Layout, Panel, NavDrawer } from 'react-toolbox/lib/layout';

import Teletipo from '_components/teletipo';
import Sector from '_components/sector';
import Errors from '_components/errors';

import { sectoresList } from '_store/selectors';

export function MimicoComponent({ sectores }) {
  return (
    <div className="mimico">
      <Errors />
      <AppBar
        title="CTC"
        leftIcon="menu"
        rightIcon="plus"
        onLeftIconClick={this.onDropdownClick}
        onRightIconClick={this.openTeletipo}
      >
        <Navigation type="horizontal">
          {sectores.map(sector => (
            <Link
              href={`...${sector.nombre}`}
              label={sector.label}
              key={sector.nombre}
              active={this.props.match.params.sector === sector.nombre}
            />
          ))}
        </Navigation>
      </AppBar>
      <Layout>
        <NavDrawer>
          <Teletipo />
        </NavDrawer>
        <Panel>
          <Sector />
        </Panel>
      </Layout>
    </div>
  );
}

MimicoComponent.propTypes = {
  sectores: PropTypes.arrayOf(PropTypes.string),
};

export const mapStateToProps = state => sectoresList(state);

export default connect(mapStateToProps)(MimicoComponent);
