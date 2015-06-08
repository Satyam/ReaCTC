var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';

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
	}
});
