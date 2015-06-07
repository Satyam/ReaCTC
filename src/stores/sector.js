var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';

var cache = {},
	sector = {};

export default Reflux.createStore({
	listenables: actions,
	load: function (nombre, action) {
		if (nombre in cache) {
			sector = cache[nombre];
			action.completed(sector);
		} else {
			http.get('/data/sector/' + nombre)
				.then(function (response) {
					sector = cache[nombre] = response.body;
					action.completed(sector);
				})
				.catch(function (response) {
					sector = {};
					action.failed(
						response.message || (response.statusCode + ': ' + response.body)
					);
				});
		}
	},
	getInitialState: function () {
		return {};
	},
	onNewTabSector: function (nombre) {
		this.load(nombre, actions.newTabSector);
	},
	onNewTabSectorCompleted: function () {
		this.trigger(sector);
	},
	onNewTabSectorFailed: function (err) {
		actions.error(err);
		this.trigger(sector);
	},
	onActiveTabSector: function (nombre) {
		this.load(nombre, actions.activeTabSector);
	},
	onActiveTabSectorCompleted: function () {
		this.trigger(sector);
	},
	onActiveTabSectorFailed: function (err) {
		actions.error(err);
		this.trigger(sector);
	}
});
