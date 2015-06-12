import React from 'react';
import Reflux from 'reflux';
import {RouteHandler, Navigation, State} from 'react-router';

import actions from '../../actions.js';

import _ from 'lodash';

require('./mimico.less');
import sectoresStore from '../../stores/sectores.js';
import localConfigStore from '../../stores/localConfig.js';

const sectorPathMatch = /\/sector\/(.+)/;
export default React.createClass({
	mixins: [
		Reflux.connect(sectoresStore, 'sectores'),
		Reflux.connect(localConfigStore, 'localConfig'),
		Navigation,
		State
	],
	componentWillMount: function () {
		var selected = sectorPathMatch.exec(this.getPathname());
		if (selected) selected = selected[1];
		else this.gotoFirstTab();

		actions.openTabSector(selected);

		actions.error.listen(msg => {
			this.setState({errorMsg: msg});
			global.setTimeout(() => this.setState({errorMsg: null}), 10000);
		});

	},
	closeErrorMsg: function () {
		this.setState({errorMsg: null});
	},
	onTabClick: function (ev) {
		if (!this.leftClick(ev)) return;

		var target = ev.target,
			a = target,
			tabId;

		while (a && a.tagName !== 'A') {
			a = a.parentElement;
		}
		if (a) {
			tabId = a.dataset.tabId;
			if (target.tagName === 'I') {
				actions.closeTabSector(tabId);
				if (target.dataset.tabId === this.state.localConfig.selected) {
					this.gotoFirstTab(tabId);
				}
				return;
			}
			actions.openTabSector(tabId);
			this.transitionTo('sector', {sector: tabId});
		}
	},
	gotoFirstTab: function (skip) {
		var selected = this.state.localConfig.sectores[0];
		if (selected === skip) selected = this.state.localConfig.sectores[1];
		if (selected) {
			this.replaceWith('sector', {sector: selected});
			actions.openTabSector(selected);
		} else {
			this.replaceWith('teletipo');
		}
	},
	leftClick: function (ev) {
		if (ev.button !== 0) return false;
		if (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) return false;
		ev.preventDefault();
		return true;
	},
	onDropdownItemClick: function (ev) {
		if (!this.leftClick(ev)) return;
		this.toggleDropdown();
		this.transitionTo('sector', {sector: ev.target.dataset.sectorId});
		actions.openTabSector(ev.target.dataset.sectorId);
	},
	onDropdownClick: function (ev) {
		if (!this.leftClick(ev)) return;
		this.toggleDropdown();
	},
	toggleDropdown: function() {
		this.setState({dropdownDisplay: this.state.dropdownDisplay === 'block' ? 'none' : 'block'});
	},
	openTeletipo: function (ev) {
		if (!this.leftClick(ev)) return;
		actions.openTabSector(null);
		this.transitionTo('teletipo');
	},
	render: function () {
		var lc = this.state.localConfig,
			sectores = _.sortBy(this.state.sectores, 'nombre'),
			selected = lc.selected,
			visibles = lc.sectores;

		return (
			<div className="mimico">
				{this.state.errorMsg && (
					<div onClick={this.closeErrorMsg} className="panel panel-warning error-msg">
						<div className="panel-heading">
							<i className="fa fa-close"/><h3 className="panel-title">Atención</h3>
						</div>
						<div className="panel-body">
							{this.state.errorMsg}
						</div>
					</div>
				)}
				<ul className="nav nav-tabs">
					{ sectores.map(sector => {
						return (
							(visibles.indexOf(sector.nombre) > -1 ? (
								<li
									key={sector.nombre}
									role="presentation"
									className={selected === sector.nombre ? 'active' : ''}
								>
									<a data-tab-id={sector.nombre} onClick={this.onTabClick}>{sector.label}
										<i className="fa fa-close"/>
									</a>
								</li>
								) : null)
						);
					})}
					<li role="presentation" className="dropdown">
						<a
							className="dropdown-toggle btn-info"
							data-toggle="dropdown"
							href="#"
							onClick={this.onDropdownClick}
						>
							<i className="fa fa-plus"></i>
						</a>
						<ul className="dropdown-menu" role="menu" style={{
							display: this.state.dropdownDisplay
						}}>
						{sectores.map(sector => {
							return (visibles.indexOf(sector.nombre) === -1 ?
								(<li
									key={sector.nombre}
									title={sector.descr}
									data-sector-id={sector.nombre}
									onClick={this.onDropdownItemClick}
								>
									{sector.label}
								</li>) :
								null);
							})
							}
					</ul>
					</li>
					<li className={'navbar-right' + (!selected ? ' active' : '')}>
						<a href="teletipo" onClick={this.openTeletipo}>Teletipo</a>
					</li>
				</ul>
				<RouteHandler />
			</div>
		);
	}
});
