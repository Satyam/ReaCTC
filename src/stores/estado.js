var Reflux = require('reflux');

import actions from '../actions.js';
import {splitCoords} from '../common/common.js';

var svgNode,
	sector,
	estado = {};

export default Reflux.createStore({
	listenables: actions,
	getInitialState: function () {
		return {};
	},
	onSectorUpdated: function (data) {
		svgNode = data.svgNode;
		sector = data.sector;
	},
	onClickCelda: function (data) {
		var [x, y] = splitCoords(data.coords);
		var ancho = sector.ancho,
			alto = sector.alto;

		var izq = x > ancho / 2;

		estado = {
			nombreSector: data.nombreSector,
			side: izq ? 'left' : 'right',
			// 300 viene de estado/estado.less (eso esta muy mal)
			left: (x + (izq ? 0 : 1)) / ancho * svgNode.offsetWidth + svgNode.offsetLeft - (izq ? 300 : 0),
			top: y / alto * svgNode.offsetHeight + svgNode.offsetTop,
			celda: sector.getCelda(data.coords),
			senal: null,
			visible: true
		};
		this.trigger(estado);
	},
	onClickSenal: function (data) {
		var [x, y] = splitCoords(data.coords);
		var ancho = sector.ancho,
			alto = sector.alto;

		var izq = x > ancho / 2;

		estado = {
			nombreSector: data.nombreSector,
			side: izq ? 'left' : 'right',
			// 300 viene de estado/estado.less (eso esta muy mal)
			left: (x + (izq ? 0 : 1)) / ancho * svgNode.offsetWidth + svgNode.offsetLeft - (izq ? 300 : 0),
			top: y / alto * svgNode.offsetHeight + svgNode.offsetTop,
			celda: sector.getCelda(data.coords),
			senal: data.dir,
			visible: true
		};
		this.trigger(estado);
	},
	onCambio: function () {
		this.trigger(estado);
	},
	onTriple: function () {
		this.trigger(estado);
	},
	onCloseEstado: function () {
		estado.visible = false;
		this.trigger(estado);
	}
});
