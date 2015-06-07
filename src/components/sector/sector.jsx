import React from 'react';
import Reflux from 'reflux';
// import actions from '../../actions.js';

import {ANCHO_CELDA} from '../../common/common.js';

import _ from 'lodash';

require('./sector.less');

import sectorStore from '../../stores/sector.js';

import Celda from '../celda/celda.jsx';

export default React.createClass({
	mixins: [
		Reflux.connect(sectorStore, 'sector')
	],
	render: function () {
		var sector = this.state.sector;
		if (_.isEmpty(sector)) return (<div className='sector'>cargando ...</div>);
		return (
			<div className='sector'>
				<div className="popover right in" style={{top: '26px', left: '232.109375px', display: 'block'}}>
					<div className="arrow" style={{top: '50%'}}></div>
					<h3 className="popover-title">Popover title</h3>
					<div className="popover-content">And here's some amazing content. It's very engaging. Right?</div>
				</div>
				<svg viewBox={`0 0 ${sector.ancho * ANCHO_CELDA} ${sector.alto * ANCHO_CELDA}`}>
					{_.map(sector.celdas, (celda, coords) => <Celda key={coords} coords={coords} celda={celda}/>)}
				</svg>
			</div>
		);
	}
});
