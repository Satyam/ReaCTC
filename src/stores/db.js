var Reflux = require('reflux');

import http from '../common/http.js';
import actions from '../actions.js';
import path from 'path';

// import _ from 'lodash';

export default Reflux.createStore({
	listenables: actions,
	onCambio: function (data) {
		http.post(path.join('/action', data.nombreSector, data.coords, 'cambio'), {desviado: data.desviado});
	},
	onTriple: function (data) {
		http.post('/action/triple', data);
	},
	onManual: function (data) {
		http.post('/action/manual', data);
	}
});
