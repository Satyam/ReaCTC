import React from 'react'; // eslint-disable-line no-unused-vars

import actions from '../../actions.js';

import {Componente, ANCHO_CELDA} from '../../common/common.js';

import _ from 'lodash';

require('./sector.less');

import sectorStore from '../../stores/sector.js';

import Celda from '../celda/celda.jsx';
import Estado from '../estado/estado.jsx';

export default class Sector extends Componente {
	getStores () {
		return [sectorStore];
	}
	render () {
		var sector = this.state.sector;
		console.log('sector.render', sector, _.isEmpty(sector)); // eslint-disable-line no-console
		return (<div className='sector'>
			<Estado />
			{_.isEmpty(sector) ? (<img className="loading" src="/loading.gif" />) : (
				<svg ref="svg" viewBox={`0 0 ${sector.ancho * ANCHO_CELDA} ${sector.alto * ANCHO_CELDA}`}>
					{_.map(sector.celdas, (celda, coords) => (
						<Celda key={coords} coords={coords} celda={celda} nombreSector={sector.nombre}/>
					))}
				</svg>
			)}
		</div>);
	}
	componentDidUpdate () {
		if (this.refs.svg) {
			actions.sectorUpdated.defer({
				svgNode: this.refs.svg.getDOMNode(),
				sector: this.state.sector
			});
		}
	}
}
