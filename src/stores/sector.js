var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';

import _ from 'lodash';

var cache = {},
	sector = {};

var prioridades = [
	'verde',
	'precaucion',
	'alto'
];

class Sector {
	constructor (nombre, config) {
		_.merge(this, config);
		this.nombre = nombre;
		_.each(this.celdas, (celda, coords) => celda.coords = coords);
		if (this.enclavamientos) {
			let agregarEnclavamiento = (coords, enclavamiento) => {
				let celda = this.getCelda(coords);
				if (!_.isArray(celda.enclavamientos)) celda.enclavamientos = [];
				celda.enclavamientos.push(enclavamiento);
			};
			this.enclavamientos.forEach((enclavamiento, index) => {
				enclavamiento.id = index;
				if (enclavamiento.celda) agregarEnclavamiento(enclavamiento.celda, enclavamiento);
				_.each(enclavamiento.celdas, celda => agregarEnclavamiento(celda, enclavamiento));
			});
			let reintentos = 10;
			while (reintentos--) {
				if (this.enclavamientos.reduce((prevVal, enclavamiento) => {
						return prevVal + this.dispatchEnclavamiento(enclavamiento) ? 1 : 0;
					}, 0) === 0) break;
			}
			if (reintentos === -1) {
				actions.error({
					msg: 'El estado inicial de los enclavamientos no se ha estabilizado luego de varias iteraciones'
				});
			}
		}
	}
	dispatchEnclavamiento (enclavamiento, celda, estado) {
		var e = this[enclavamiento.tipo];
		if (e) return e.call(this, enclavamiento, celda, estado);
	}
	apareados (enclavamiento, celda, estado) {
		var huboCambio = 0,
			desviado;
		celda = celda || this.getCelda(enclavamiento.celdas[0]);

		if (celda._enProceso) return false;
		celda._enProceso = true;

		desviado = !!(estado ? estado.desviado : celda.desviado);
		enclavamiento.celdas.forEach(coord => {
			let celdaDest = this.getCelda(coord);
			if (celda === celdaDest) return;
			if ((celdaDest.desviado || false) === desviado) return;

			if (celdaDest.manual) {
				actions.teletipo({
					sector: this.descr,
					coords: celdaDest.coords,
					msg: 'Cambio automático propagado a celda en manual desde ' + celda.coords
				});
				return;
			}

			if (celdaDest._enProceso) {
				actions.teletipo({
					sector: this.descr,
					coords: celdaDest.coords,
					msg: 'Lazo infinito de enclavamiento desde ' + celda.coords
				});
				return;
			}

			celdaDest._enProceso = true;
			celdaDest.desviado = desviado;
			actions.cambio({
				nombreSector: this.nombre,
				coords: celdaDest.coords,
				desviado: desviado
			});
			celdaDest._enProceso = false;
			huboCambio++;
		});
		celda._enProceso = false;
		return !!huboCambio;
	}
	senalCambio (enclavamiento, celda, estado) {
		var cambiosEfectuados = 0,
			alternativa;

		celda = celda || this.getCelda(enclavamiento.celda);
		alternativa = (estado ? estado.desviado : celda.desviado) ? 'desviado' : 'normal';
		_.each(enclavamiento[alternativa], (color, luz) => {
			cambiosEfectuados += this.votaPor(enclavamiento.senal, luz, color, enclavamiento.id);
		});
		return cambiosEfectuados;
	}
	senalTriple (enclavamiento, celda, estado) {
		var cambiosEfectuados = 0,
			alternativa;

		celda = celda || this.getCelda(enclavamiento.celda);
		alternativa = ['izq', 'centro', 'der'][((estado && estado.posicion) || celda.posicion || 0) + 1];
		_.each(enclavamiento[alternativa], (color, luz) => {
			cambiosEfectuados += this.votaPor(enclavamiento.senal, luz, color, enclavamiento.id);
		});
		return cambiosEfectuados;
	}
	votaPor (coords, luz, color, id = -1) {
		var senal = this.getSenal(coords),
			l = senal[luz];
		if (!l.votos) l.votos = {};
		l.votos[id] = color;
		var nuevoEstado = prioridades[_.reduce(l.votos, (pri, value) => {
			return Math.max(prioridades.indexOf(value), pri);
		}, 0)];
		if (nuevoEstado !== l.estado) {
			l.estado = nuevoEstado;
			actions.senal({
				nombreSector: this.nombre,
				coords: coords,
				luz: luz,
				estado: nuevoEstado
			});
			return 1;
		}
		return 0;
	}
	getCelda(x, y) {
		var coord = arguments.length === 2 ? x + ',' + y : x;
		return this.celdas[coord];
	}
	getSenal(x, y, dir) {
		if (arguments.length === 1) {
			[x, y, dir] = x.split(',');
		}
		var celda = this.celdas[[x, y].join(',')];
		if (celda) return celda.senales[dir];
		// otherwise, returns undefined
	}
}

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
					sector = cache[nombre] = new Sector(nombre, response.body);
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
		var celda = sector.getCelda(estado.coords);
		celda.desviado = estado.desviado;
		_.each(celda.enclavamientos, encl => sector.dispatchEnclavamiento(encl, celda, estado));
		this.trigger(sector);
	},
	onTriple: function (estado) {
		var celda = sector.getCelda(estado.coords);
		celda.posicion = estado.posicion;
		_.each(celda.enclavamientos, encl => sector.dispatchEnclavamiento(encl, celda, estado));
		this.trigger(sector);
	},
	onManual: function (estado) {
		sector.celdas[estado.coords].manual = estado.manual;
		this.trigger(sector);
	}
});
