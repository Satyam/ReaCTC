import React from 'react';
require('./celda.less');

import {ANCHO_CELDA, CENTRO_CELDA, X, Y} from '../../common/common.js';

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
	render: function () {

		var coords = this.props.coords.split(','),
			x = parseInt(coords[0], 10),
			y = parseInt(coords[1], 10),
			celda = this.props.celda,
			label = celda.descr || `[${x},${y}]`,
			seleccionada = this.props.seleccionada ? 'seleccionada' : 'oculta',
			renderer = this[celda.tipo];

		return (
			<g transform={`translate(${x * ANCHO_CELDA}, ${y * ANCHO_CELDA})`}>
				<rect x='0' y='0' width={ANCHO_CELDA} height={ANCHO_CELDA} className={seleccionada} />
				{ renderer && renderer.call(this, celda) }
				<text x="5" y="95">{label}</text>
			</g>
		);
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
			<Linea dest={celda.normal.dir} estilo={celda._desviado ? 'off' : null} />
			<Linea dest={celda.invertido.dir} estilo={!celda._desviado ? 'off' : null} />
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
			<Linea dest={celda.centro.dir} estilo={celda._posicion ? 'off' : null} />
			<Linea dest={celda.izq.dir} estilo={celda._posicion != -1 ? 'off' : null} />
			<Linea dest={celda.der.dir} estilo={celda._posicion != 1 ? 'off' : null} />
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
