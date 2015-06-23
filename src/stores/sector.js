var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';

import _ from 'lodash';

var cache = {},
	sector = {};

var prioridades = [
	'libre',
	'precaucion',
	'alto'
];

var coordsRX = /(\d+,\d+)(,(.+))?/;

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
			var interval = global.setInterval(() => {
				reintentos--;
				var changes = this.enclavamientos.reduce((prevVal, enclavamiento) => {
					return prevVal + this.dispatchEnclavamiento(enclavamiento) ? 1 : 0;
				}, 0);
				if (changes === 0) {
					global.clearInterval(interval);
				} else if (reintentos === 0) {
					global.clearInterval(interval);
					actions.error({
						msg: 'El estado inicial de los enclavamientos no se ha estabilizado luego de varias iteraciones'
					});
				}
			}, 0);
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
					msg: 'Cambio automático propagado a celda en manual desde ' + celda.coords,
					nivel: 1
				});
				return;
			}

			if (celdaDest._enProceso) {
				actions.teletipo({
					sector: this.descr,
					coords: celdaDest.coords,
					msg: 'Lazo infinito de enclavamiento desde ' + celda.coords,
					nivel: 2
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
	getCelda(coords) {
		coords = coords.replace(coordsRX, '$1');
		return this.celdas[coords];
	}
	getSenal(coords) {
		var match = coordsRX.exec(coords);
		var celda = this.celdas[match[1]];
		if (celda) return celda.senales[match[3]];
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
		var celda = sector.getCelda(estado.coords);
		if (estado.luz) {
			var senal = sector.getSenal(estado.coords);
			senal[estado.luz].manual = estado.manual;
		} else {
			celda.manual = estado.manual;
		}
		_.each(celda.enclavamientos, encl => sector.dispatchEnclavamiento(encl, celda));
		this.trigger(sector);
	},
	onSenal: function (estado) {
		var senal = sector.getSenal(estado.coords);
		senal[estado.luz].estado = estado.estado;
		this.trigger(sector);
	}
});
