import React from 'react';
import {RouteHandler} from 'react-router';

import actions from '../../actions.js';
import {leftButton, Componente} from '../../common/common.js';

import _ from 'lodash';

require('./mimico.less');
import sectoresStore from '../../stores/sectores.js';
import localConfigStore from '../../stores/localConfig.js';
import erroresStore from '../../stores/errores.js';

const sectorPathMatch = /\/sector\/(.+)/;

export default class Mimico extends Componente {
	getStores () {
		return [
			sectoresStore,
			localConfigStore,
			erroresStore
		];
	}
	componentWillMount () {
		console.log('Mimico:componentWillMount');// eslint-disable-line no-console
		var path = this.context.router.getCurrentPath(),
			selected = sectorPathMatch.exec(path);
		if (selected) actions.openTabSector(selected[1]);
		else if (path === '/teletipo') actions.openTabSector(null);
		else this.gotoFirstTab();

	}
	componentWillReceiveProps () {
		console.log('Mimico:componentWillReceiveProps');// eslint-disable-line no-console
		var path = this.context.router.getCurrentPath(),
			selected = sectorPathMatch.exec(path);
		if (selected) actions.openTabSector(selected[1]);
		else if (path === '/teletipo') actions.openTabSector(null);
	}
	closeErrorMsg () {
		this.setState({errores: []});
	}
	onTabClick (ev) {
		if (!leftButton(ev)) return;

		var target = ev.target,
			a = target,
			tabId,
			currentTab = this.state.localConfig.selected;

		while (a && a.tagName !== 'A') {
			a = a.parentElement;
		}
		if (a) {
			console.log('Mimico:onTabClick', tabId);// eslint-disable-line no-console
			tabId = a.dataset.tabId;
			if (target.tagName === 'I') {
				actions.closeTabSector(tabId);
				if (tabId === currentTab) {
					this.gotoFirstTab(tabId);
				}
				return;
			}
			// actions.openTabSector(tabId);
			this.context.router.transitionTo('sector', {sector: tabId});
		}
	}
	gotoFirstTab (skip) {
		console.log('Mimico:gotoFirstTab', skip);// eslint-disable-line no-console
		var selected = this.state.localConfig.sectores[0];
		if (selected === skip) selected = this.state.localConfig.sectores[1];
		if (selected) {
			// actions.openTabSector(selected);
			this.context.router.replaceWith('sector', {sector: selected});
		} else {
			// actions.openTabSector(null);
			this.context.router.replaceWith('teletipo');
		}
	}
	onDropdownItemClick (ev) {
		if (!leftButton(ev)) return;
		this.toggleDropdown();
		this.context.router.transitionTo('sector', {sector: ev.target.dataset.sectorId});
		// actions.openTabSector(ev.target.dataset.sectorId);
	}
	onDropdownClick (ev) {
		if (!leftButton(ev)) return;
		this.toggleDropdown();
	}
	toggleDropdown() {
		this.setState({dropdownDisplay: this.state.dropdownDisplay === 'block' ? 'none' : 'block'});
	}
	openTeletipo (ev) {
		if (!leftButton(ev)) return;
		// actions.openTabSector(null);
		this.context.router.transitionTo('teletipo');
	}
	render () {
		var st = this.state,
			lc = st.localConfig,
			sectores = _.sortBy(st.sectores, 'nombre'),
			selected = lc.selected,
			visibles = lc.sectores || [];

		console.log('Mimico.render', this.state, selected);// eslint-disable-line no-console
		return (
			<div className="mimico">
				<div
					style={{display: st.errores.length ? 'block' : 'none'}}
					onClick={this.closeErrorMsg.bind(this)}
					className="panel panel-warning error-msg"
				>
					<div className="panel-heading">
						<i className="fa fa-close"/><h3 className="panel-title">Atención</h3>
					</div>
					<div className="panel-body">
						{_.map(st.errores, (error, index) => {
							return (<div key={index} className="row" >{error.msg}</div>);
						})}
					</div>
				</div>
				<ul className="nav nav-tabs">
					{ sectores.map(sector => {
						return (
							(visibles.indexOf(sector.nombre) > -1 ? (
								<li
									key={sector.nombre}
									role="presentation"
									className={selected === sector.nombre ? 'active' : ''}
								>
									<a data-tab-id={sector.nombre} onClick={this.onTabClick.bind(this)}>{sector.label}
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
							onClick={this.onDropdownClick.bind(this)}
						>
							<i className="fa fa-plus"></i>
						</a>
						<ul className="dropdown-menu" role="menu" style={{
							display: st.dropdownDisplay
						}}>
						{sectores.map(sector => {
							return (visibles.indexOf(sector.nombre) === -1 ?
								(<li
									key={sector.nombre}
									title={sector.descr}
									data-sector-id={sector.nombre}
									onClick={this.onDropdownItemClick.bind(this)}
								>
									{sector.label}
								</li>) :
								null);
							})
							}
					</ul>
					</li>
					<li className={'navbar-right' + (!selected ? ' active' : '')}>
						<a href="teletipo" onClick={this.openTeletipo.bind(this)}>Teletipo</a>
					</li>
				</ul>
				<RouteHandler />
			</div>
		);
	}
}

Mimico.contextTypes = {
	router: React.PropTypes.func.isRequired
};
