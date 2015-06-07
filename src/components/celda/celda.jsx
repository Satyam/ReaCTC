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
			tipo = celda.tipo,
			label = celda.descr || `[${x},${y}]`,
			seleccionada = this.props.seleccionada ? 'seleccionada' : 'oculta';

		return (
			<g transform={`translate(${x * ANCHO_CELDA}, ${y * ANCHO_CELDA})`}>
				<rect x='0' y='0' width={ANCHO_CELDA} height={ANCHO_CELDA} className={seleccionada} />
				{tipo === 'linea' ? (<Linea dest={celda.desde.dir} />) : null}
				{tipo === 'linea' ? (<Linea dest={celda.hacia.dir} />) : null}
				<text x="5" y="95">{label}</text>
			</g>
		);
	}
});
