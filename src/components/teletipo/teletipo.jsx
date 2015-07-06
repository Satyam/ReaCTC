import React from 'react';
import _ from 'lodash';

require('./teletipo.less');

var colores = [
	'',
	'warning',
	'danger'
];

import teletipoStore from '../../stores/teletipo.js';

export default React.createClass({
	getInitialState: function () {
		return teletipoStore.getState();
	},
	componentDidMount: function () {
		this.unlisteners = [
			teletipoStore.listen(state => {
				this.setState(state);
			})
		];
	},
	componentWillUnmount: function () {
		this.unlisteners.forEach(u => u());
	},
	render: function () {
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
});
