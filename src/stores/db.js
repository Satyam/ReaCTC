var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';
import path from 'path';
import localConfigStore from './localConfig.js';

// import _ from 'lodash';

var terminalID;

export default Reflux.createStore({
	listenables: actions,
	init: function() {
        this.listenTo(localConfigStore, this.onLocalConfigChange);
		terminalID = localConfigStore.getInitialState().terminalID;
		if (!terminalID) {
			http.get('/action/id').then(response => {
				actions.setLocalConfig('terminalID', response.body.id);
			});
		}
	},
	onLocalConfigChange: function (data) {
		terminalID = data.terminalID;
	},

	onCambio: function (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'cambio'), {desviado: data.desviado});
	},
	onTriple: function (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'triple'), {posicion: data.posicion});
	},
	onManual: function (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'manual'), {
			manual: data.manual,
			luz: data.luz
		});
	},
	onSenal: function (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'senal'), {
			luz: data.luz,
			estado: data.estado
		});
	}
});
