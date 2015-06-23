import React, {PropTypes} from 'react';
require('./celda.less');
import actions from '../../actions.js';
import {ANCHO_CELDA, CENTRO_CELDA, X, Y} from '../../common/common.js';
import _ from 'lodash';

import Senal from '../senal/senal.jsx';

var Linea = React.createClass({
	render: function () {
		var dest = this.props.dest,
			estilo = this.props.estilo || '';

		return (<line
			x1={CENTRO_CELDA}
			y1={CENTRO_CELDA}
			x2={X[dest]}
			y2={Y[dest]}
			className={estilo}
		/>);
	}
});

export default React.createClass({
	propTypes: {
		// <Celda key={coords} coords={coords} celda={celda} nombreSector={sector.nombre}/>
		coords: PropTypes.string.isRequired,
		celda: PropTypes.shape({
			tipo: PropTypes.string.isRequired
		}),
		nombreSector: PropTypes.string.isRequired
	},
	render: function () {

		var coords = this.props.coords.split(','),
			x = parseInt(coords[0], 10),
			y = parseInt(coords[1], 10),
			celda = this.props.celda,
			label = celda.descr || `[${x},${y}]`,
			renderer = this[celda.tipo];

		this.x = x;
		this.y = y;

		return (
			<g
				transform={`translate(${x * ANCHO_CELDA}, ${y * ANCHO_CELDA})`}
				onClick={this.onClick}
			>
				<rect x='0' y='0' width={ANCHO_CELDA} height={ANCHO_CELDA} className={(celda.manual ? 'manual' : '')} />
				{ renderer && renderer.call(this, celda) }
				<text x="5" y="95">{label}</text>
				{_.map(celda.senales, (senal, dir) => (<Senal dir={dir} luces={senal} key={dir}/>))}
			</g>
		);
	},
	onClick: function (ev) {
		if (ev.button !== 0) return false;
		if (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) return false;
		ev.preventDefault();
		ev.stopPropagation();
		actions.clickCelda({
			nombreSector: this.props.nombreSector,
			coords: this.props.coords,
			x: this.x,
			y: this.y
		});
	},
	linea: function (celda) {
		return (<g>
			<Linea dest={celda.desde.dir} />
			<Linea dest={celda.hacia.dir} />
		</g>);
	},
	cambio: function (celda) {
		return (<g>
			<Linea dest={celda.punta.dir} />
			<Linea dest={celda.normal.dir} estilo={celda.desviado ? 'off' : null} />
			<Linea dest={celda.invertido.dir} estilo={!celda.desviado ? 'off' : null} />
		</g>);
	},
	paragolpe: function (celda) {
		return (<g>
			<Linea dest={celda.desde.dir} />
			<circle cx={CENTRO_CELDA}
					cy={CENTRO_CELDA}
					r={ANCHO_CELDA / 10}
			/>
		</g>);
	},
	triple: function (celda) {
		return (<g>
			<Linea dest={celda.punta.dir} />
			<Linea dest={celda.centro.dir} estilo={celda.posicion ? 'off' : null} />
			<Linea dest={celda.izq.dir} estilo={celda.posicion !== -1 ? 'off' : null} />
			<Linea dest={celda.der.dir} estilo={celda.posicion !== 1 ? 'off' : null} />
		</g>);
	},
	cruce: function (celda) {
		return (<g>
			<Linea dest={celda.l1.desde.dir} />
			<Linea dest={celda.l1.hacia.dir} />
			<Linea dest={celda.l2.desde.dir} />
			<Linea dest={celda.l2.hacia.dir} />
		</g>);
	}
});
