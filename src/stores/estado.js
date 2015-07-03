import alt from '../alt.js';

import actions from '../actions.js';
import {splitCoords} from '../common/common.js';

var svgNode,
	sector;

class EstadoStore {
	constructor () {
		this.estado = {};
		this.bindActions(actions);
	}
	onSectorUpdated (data) {
		svgNode = data.svgNode;
		sector = data.sector;
	}
	onClickCelda (data) {
		var [x, y] = splitCoords(data.coords);
		var ancho = sector.ancho,
			alto = sector.alto;

		var izq = x > ancho / 2;

		this.estado = {
			nombreSector: data.nombreSector,
			side: izq ? 'left' : 'right',
			// 300 viene de estado/estado.less (eso esta muy mal)
			left: (x + (izq ? 0 : 1)) / ancho * svgNode.offsetWidth + svgNode.offsetLeft - (izq ? 300 : 0),
			top: y / alto * svgNode.offsetHeight + svgNode.offsetTop,
			celda: sector.getCelda(data.coords),
			senal: null,
			visible: true
		};
	}
	onClickSenal (data) {
		var [x, y] = splitCoords(data.coords);
		var ancho = sector.ancho,
			alto = sector.alto;

		var izq = x > ancho / 2;

		this.estado = {
			nombreSector: data.nombreSector,
			side: izq ? 'left' : 'right',
			// 300 viene de estado/estado.less (eso esta muy mal)
			left: (x + (izq ? 0 : 1)) / ancho * svgNode.offsetWidth + svgNode.offsetLeft - (izq ? 300 : 0),
			top: y / alto * svgNode.offsetHeight + svgNode.offsetTop,
			celda: sector.getCelda(data.coords),
			senal: data.dir,
			visible: true
		};
	}
	onCloseEstado () {
		this.estado.visible = false;
	}
}

export default alt.createStore(EstadoStore, 'EstadoStore');
