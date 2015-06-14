var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';

import _ from 'lodash';

var cache = {},
	sector = {};

export default Reflux.createStore({
	listenables: actions,
	getInitialState: function () {
		return {};
	},
	onOpenTabSector: function (nombre) {
		if (!nombre) {
			sector = null;
			return;
		}
		if (cache[nombre]) {
			sector = cache[nombre];
			actions.openTabSector.completed(sector);
		} else {
			http.get('/data/sector/' + nombre)
				.then(function (response) {
					sector = cache[nombre] = response.body;
					sector.nombre = nombre;
					_.each(sector.celdas, (celda, coords) => celda.coords = coords);
					actions.openTabSector.completed(sector);
				})
				.catch(function (response) {
					sector = {};
					actions.openTabSector.failed(
						response.message || (response.statusCode + ': ' + response.body)
					);
				});
		}
	},
	onOpenTabSectorCompleted: function () {
		this.trigger(sector);
	},
	onOpenTabSectorFailed: function (err) {
		actions.error(err);
		this.trigger(sector);
	},
	onCloseTabSector: function (nombre) {
		if (sector === cache[nombre]) {
			sector = {};
			this.trigger(sector);
		}
		cache[nombre] = null;
	},
	onCambio: function (estado) {
		sector.celdas[estado.coords].desviado = estado.desviado;
		this.trigger(sector);
	},
	onTriple: function (estado) {
		sector.celdas[estado.coords].posicion = estado.posicion;
		this.trigger(sector);
	},
	onManual: function (estado) {
		sector.celdas[estado.coords].manual = estado.manual;
		this.trigger(sector);
	}
});
