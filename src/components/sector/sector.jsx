import React from 'react';
import Reflux from 'reflux';
import actions from '../../actions.js';

import {ANCHO_CELDA} from '../../common/common.js';

import _ from 'lodash';

require('./sector.less');

import sectorStore from '../../stores/sector.js';

import Celda from '../celda/celda.jsx';
import Estado from '../estado/estado.jsx';

export default React.createClass({
	mixins: [
		Reflux.connect(sectorStore, 'sector')
	],
	componentWillMount: function () {

	},
	render: function () {
		var state = this.state,
			sector = state.sector;
		if (_.isEmpty(sector)) return (<div className='sector'>cargando ...</div>);
		return (
			<div className='sector'>
				<Estado params={state.popover} />
				<svg ref="svg" viewBox={`0 0 ${sector.ancho * ANCHO_CELDA} ${sector.alto * ANCHO_CELDA}`}>
					{_.map(sector.celdas, (celda, coords) => <Celda key={coords} coords={coords} celda={celda}/>)}
				</svg>
			</div>
		);
	},
	componentDidUpdate: function () {
		if (this.refs.svg) {
			actions.sectorUpdated({
				svgNode: this.refs.svg.getDOMNode(),
				sector: this.state.sector
			});
		}
	}
});
