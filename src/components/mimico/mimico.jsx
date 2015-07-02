import React from 'react';
// import Reflux from 'reflux';
import {RouteHandler, Navigation, State} from 'react-router';

import actions from '../../actions.js';
import {leftButton} from '../../common/common.js';

import _ from 'lodash';

require('./mimico.less');
import sectoresStore from '../../stores/sectores.js';
import localConfigStore from '../../stores/localConfig.js';
import erroresStore from '../../stores/errores.js';

const sectorPathMatch = /\/sector\/(.+)/;
export default React.createClass({
	mixins: [
		Navigation,
		State
	],
	getInitialState: function () {
		return _.merge(localConfigStore.getState(), {errores:[], sectores:[]});
	},
	componentDidMount: function () {
		this.unlisteners = [
			sectoresStore.listen(state => {
				this.setState(state);
			}),
			erroresStore.listen(state => {
				this.setState(state);
			}),
			localConfigStore.listen(state => {
				this.setState(state);
			})
		];
	},
	componentWillUnmount: function () {
		this.unlisteners.forEach(u => u());
	},
	componentWillMount: function () {
		var selected = sectorPathMatch.exec(this.getPathname());
		if (selected) selected = selected[1];
		else this.gotoFirstTab();

		actions.openTabSector(selected);

	},
	closeErrorMsg: function () {
		this.setState({errores: []});
	},
	onTabClick: function (ev) {
		if (!leftButton(ev)) return;

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
//		var selected = this.state && this.state.localConfig && this.state.localConfig.sectores[0];
//		if (selected === skip) selected = this.state.localConfig.sectores[1];
//		if (selected) {
//			this.replaceWith('sector', {sector: selected});
//			actions.openTabSector(selected);
//		} else {
			this.replaceWith('teletipo');
//		}
	},
	onDropdownItemClick: function (ev) {
		if (!leftButton(ev)) return;
		this.toggleDropdown();
		this.transitionTo('sector', {sector: ev.target.dataset.sectorId});
		actions.openTabSector(ev.target.dataset.sectorId);
	},
	onDropdownClick: function (ev) {
		if (!leftButton(ev)) return;
		this.toggleDropdown();
	},
	toggleDropdown: function() {
		this.setState({dropdownDisplay: this.state.dropdownDisplay === 'block' ? 'none' : 'block'});
	},
	openTeletipo: function (ev) {
		if (!leftButton(ev)) return;
		actions.openTabSector(null);
		this.transitionTo('teletipo');
	},
	render: function () {
		var st = this.state,
			lc = st.localConfig,
			sectores = _.sortBy(st.sectores, 'nombre'),
			selected = lc.selected,
			visibles = lc.sectores || [];

		return (
			<div className="mimico">
				{st.errores.length ? (
					<div onClick={this.closeErrorMsg} className="panel panel-warning error-msg">
						<div className="panel-heading">
							<i className="fa fa-close"/><h3 className="panel-title">Atención</h3>
						</div>
						<div className="panel-body">
							{_.map(st.errores, (error, index) => {
								return (<div key={index}>{error.msg}</div>);
							})}
						</div>
					</div>
				) : null}
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
							display: st.dropdownDisplay
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
