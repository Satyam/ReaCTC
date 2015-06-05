var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';


actions.loadSector.listen(function (nombre) {
	http.get('/data/sector/' + nombre)
		.then(function (response) {
			actions.loadSector.completed({
				status: 'ok',
				data: response.body
			});
		})
		.catch(function (response) {
			actions.loadSector.failed({
				status: 'fail',
				message: response.message || (response.statusCode + ': ' + response.body)
			});
		});
});

export default Reflux.createStore({
	listenables: actions,
	getInitialState: function () {
		this.sector = {};
		actions.loadStore();
		return {};
	},
	onLoadSector: function (nombre) {
		console.log('Loading sector ' + nombre);
	},
	onLoadSectorCompleted: function (res) {
		this.trigger(res);
	},
	onLoadSectorFailed: function (res) {
		this.trigger(res);
	}
});
