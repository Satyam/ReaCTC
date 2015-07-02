const CTC = 'CTC';

import alt from '../alt.js';
import actions from '../actions.js';
import http from '../common/http.js';

class LocalConfigStore {
	constructor() {
		var config = global.localStorage.getItem(CTC);
		if (!config) {
			config = {
				sectores: []
			};
			this.save();
		} else {
			config = JSON.parse(config);
		}
		console.log('config', config);
		this.localConfig = config;
		if (!config.terminalID) {
			http.get('/action/id')
			.then(response => {
				this.localConfig.terminalID = response.body.id;
				this.emitChange();
			})
			.catch(response => {
				actions.error(response.message || (response.statusCode + ': ' + response.body));
			});
		}
		this.bindActions(actions);
	}
	onCloseTabSector (nombre) {
		var sectores = this.localConfig.sectores,
			index = sectores.indexOf(nombre);
		if (index > -1) {
			sectores.splice(index, 1);
			if (nombre === this.localConfig.selected) {
				this.localConfig.selected = sectores[0];
			}
			this.save();
		}
	}
	onOpenTabSector (nombre) {
		if (nombre === this.localConfig.selected) return;
		if (this.localConfig.sectores.indexOf(nombre) === -1) {
			this.localConfig.sectores.push(nombre);
		}
		this.localConfig.selected = nombre;
		this.save();
	}
	save () {
		console.log('saving new config', this.localConfig);
		global.localStorage.setItem(CTC, JSON.stringify(this.localConfig));
	}
}

export default alt.createStore(LocalConfigStore, 'LocalConfigStore');
