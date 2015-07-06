import React, {PropTypes} from 'react';
import actions from '../../actions.js';
require('./senal.less');
import {CENTRO_CELDA, ANG, leftButton} from '../../common/common.js';

export default class Senal extends React.Component {
	onClick (ev) {
		if (!leftButton(ev)) return;
		actions.clickSenal({
			nombreSector: this.props.nombreSector,
			coords: this.props.coords,
			dir: this.props.dir
		});
	}
	render () {
		/*
		Todos estos calculos son a ojo, lo cual hace bastante irrelevante las
		constances como ANCHO_CELDA y demas porque deberían hacerse proporcional
		y ajustarse segun se quiera
		*/
		var r = 5,
			y = 38,
			xTope = 95,
			x1 = xTope - 2 * r,
			x2 = x1 - 2 * r + 2,
			luces = this.props.luces;

		return (
			<g
				className="senal"
				transform={`rotate(${ANG[this.props.dir]}, ${CENTRO_CELDA}, ${CENTRO_CELDA})`}
				onClick={this.onClick.bind(this)}
			>
				<line x1={xTope} y1={y} x2={x2 + r} y2={y} />
				<line x1={xTope} y1={y - r} x2={xTope} y2={y + r} />
				<circle
					className={'primaria ' + luces.primaria.estado}
					cx={(luces.izq || luces.der) ? x2 : x1}
					cy={y}
					r={r}
				/>
				{luces.izq && (<circle
					className={'izq ' + luces.izq.estado}
					cx={x1}
					cy={y + r}
					r={r}
				/>)}
				{luces.der && (<circle
					className={'der ' + luces.der.estado}
					cx={x1}
					cy={y - r}
					r={r}
				/>)}
			</g>
		);
	}
}

Senal.propTypes = {
	// <Senal dir={dir} luces={senal} key={dir}/>
	dir: PropTypes.string.isRequired,
	luces: PropTypes.object.isRequired,
	coords: PropTypes.string.isRequired,
	nombreSector: PropTypes.string.isRequired
};
