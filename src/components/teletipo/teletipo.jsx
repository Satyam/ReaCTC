import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';

require('./teletipo.less');

var colores = [
	'',
	'warning',
	'danger'
];
import {Componente} from '../../common/common.js';
import teletipoStore from '../../stores/teletipo.js';

export default class Mimico extends Componente {
	getStores () {
		return [
			teletipoStore
		];
	}
	render () {
		return (<table className="table table-striped">
			<thead>
				<tr>
					<th>Fecha</th>
					<th>Sector</th>
					<th>Celda</th>
					<th>Mensaje</th>
				</tr>
			</thead>
			<tbody>
				{_.map(this.state.mensajes, row => {
					return (<tr className={colores[row.nivel]} key={row.fecha.getTime()}>
						<td>{row.fecha.toLocaleString()}</td>
						<td>{row.sector}</td>
						<td>{row.coords}</td>
						<td>{row.msg}</td>
					</tr>);
				})}
			</tbody>
		</table>);
	}
}
