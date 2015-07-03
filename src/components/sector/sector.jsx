import React from 'react';
import actions from '../../actions.js';

import {ANCHO_CELDA} from '../../common/common.js';

import _ from 'lodash';

require('./sector.less');

import sectorStore from '../../stores/sector.js';

import Celda from '../celda/celda.jsx';
import Estado from '../estado/estado.jsx';

export default React.createClass({
	getInitialState: function () {
		return sectorStore.getState();
	},
	componentDidMount: function () {
		this.unlisteners = [
			sectorStore.listen(state => {
				this.setState(state);
			})
		];
	},
	componentWillUnmount: function () {
		this.unlisteners.forEach(u => u());
	},
	render: function () {
		var sector = this.state.sector;
		if (_.isEmpty(sector)) return (<div className='sector'><img className="loading" src="/loading.gif" /></div>);
		return (
			<div className='sector'>
				<Estado />
				<svg ref="svg" viewBox={`0 0 ${sector.ancho * ANCHO_CELDA} ${sector.alto * ANCHO_CELDA}`}>
					{_.map(sector.celdas, (celda, coords) => (
						<Celda key={coords} coords={coords} celda={celda} nombreSector={sector.nombre}/>
					))}
				</svg>
			</div>
		);
	},
	componentDidUpdate: function () {
		if (this.refs.svg) {
			actions.sectorUpdated.defer({
				svgNode: this.refs.svg.getDOMNode(),
				sector: this.state.sector
			});
		}
	}
});
