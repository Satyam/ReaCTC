import http from '../common/http.js';
import actions from '../actions.js';
import path from 'path';
import localConfigStore from './localConfig.js';
import alt from '../alt.js';

var terminalID;

class DB {
	constructor () {
		localConfigStore.listen(config => {
			terminalID = config.terminalID;
		});
		this.bindActions(actions);
	}
	onCambio (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'cambio'), {
			terminalID: terminalID,
			desviado: data.desviado
		});
	}
	onTriple (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'triple'), {
			terminalID: terminalID,
			posicion: data.posicion
		});
		return false;
	}
	onManual (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'manual'), {
			terminalID: terminalID,
			manual: data.manual,
			luz: data.luz
		});
		return false;
	}
	onSenal (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'senal'), {
			terminalID: terminalID,
			luz: data.luz,
			estado: data.estado
		});
		return false;
	}
}

export default alt.createStore(DB, 'DB');
