import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Link } from 'react-router-dom';

require('./mimico.less');

import Errors from '_components/errors';
import sectoresStore from '../../stores/sectores.js';
import localConfigStore from '../../stores/localConfig.js';
import erroresStore from '../../stores/errores.js';

const sectorPathMatch = /\/sector\/(.+)/;

export class MimicoComponent extends Component {
  componentWillMount() {
    console.log('Mimico:componentWillMount'); // eslint-disable-line no-console
    var path = this.context.router.getCurrentPath(),
      selected = sectorPathMatch.exec(path);
    if (selected) actions.openTabSector(selected[1]);
    else if (path === '/teletipo') actions.openTabSector(null);
    else {
      // The first time around there is no route to use router.replaceWith() on so it must be left for later.
      global.setTimeout(() => this.gotoFirstTab(), 0);
    }
  }
  componentWillReceiveProps() {
    console.log('Mimico:componentWillReceiveProps'); // eslint-disable-line no-console
    var path = this.context.router.getCurrentPath(),
      selected = sectorPathMatch.exec(path);
    if (selected) actions.openTabSector(selected[1]);
    else if (path === '/teletipo') actions.openTabSector(null);
  }
  onTabClick(ev) {
    if (!leftButton(ev)) return;

    var target = ev.target,
      a = target,
      tabId,
      currentTab = this.state.localConfig.selected;

    while (a && a.tagName !== 'A') {
      a = a.parentElement;
    }
    if (a) {
      console.log('Mimico:onTabClick', tabId); // eslint-disable-line no-console
      tabId = a.dataset.tabId;
      if (target.tagName === 'I') {
        actions.closeTabSector(tabId);
        if (tabId === currentTab) {
          this.gotoFirstTab(tabId);
        }
        return;
      }
      // actions.openTabSector(tabId);
      this.context.router.transitionTo('sector', { sector: tabId });
    }
  }
  gotoFirstTab(skip) {
    console.log('Mimico:gotoFirstTab', skip); // eslint-disable-line no-console
    var lc = this.state.localConfig,
      selected = lc && lc.sectores[0];
    if (selected === skip) selected = lc.sectores[1];
    if (selected) {
      // actions.openTabSector(selected);
      this.context.router.replaceWith('sector', { sector: selected });
    } else {
      // actions.openTabSector(null);
      this.context.router.replaceWith('teletipo');
    }
  }
  onDropdownItemClick(ev) {
    if (!leftButton(ev)) return;
    this.toggleDropdown();
    this.context.router.transitionTo('sector', { sector: ev.target.dataset.sectorId });
    // actions.openTabSector(ev.target.dataset.sectorId);
  }
  onDropdownClick(ev) {
    if (!leftButton(ev)) return;
    this.toggleDropdown();
  }
  toggleDropdown() {
    this.setState({ dropdownOpen: this.state.dropdownOpen ? '' : ' open' });
  }
  openTeletipo(ev) {
    if (!leftButton(ev)) return;
    // actions.openTabSector(null);
    this.context.router.transitionTo('teletipo');
  }
  render() {
    var st = this.state,
      lc = st.localConfig,
      sectores = _.sortBy(st.sectores, 'nombre'),
      selected = lc.selected,
      visibles = lc.sectores || [];

    console.log('Mimico.render', this.state, selected); // eslint-disable-line no-console
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
      </div>
    );
  }
}

Mimico.contextTypes = {
  router: React.PropTypes.func.isRequired,
};
