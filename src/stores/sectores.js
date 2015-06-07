import Reflux from 'reflux';
import http from '../common/http.js';
import actions from '../actions.js';
var sectores = {};

export default Reflux.createStore({
	listenables: actions,
	init: function () {
		http.get('/data/sectores')
			.then(function (response) {
				actions.loadSectores.completed(response.body);
			})
			.catch(function (response) {
				actions.loadSectores.failed(response.message || (response.statusCode + ': ' + response.body));
			});
	},
	getInitialState: function () {
		return {};
	},
    onLoadSectoresCompleted: function(res) {
		sectores = res;
        this.trigger(sectores);
    },
    onLoadSectoresFailed: function(res) {
		sectores = {};
		actions.error(res);
		this.trigger(sectores);
	}
});
