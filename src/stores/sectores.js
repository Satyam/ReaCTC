import alt from '../alt.js';
import http from '../common/http.js';
import actions from '../actions.js';

class SectoresStore {
	constructor() {
		this.sectores = [];
		http.get('/data/sectores')
			.then(response => {
				this.sectores = response.body;
				this.emitChange();
			})
			.catch(response => {
				actions.error(response.message || (response.statusCode + ': ' + response.body));
			});
	}
}

export default alt.createStore(SectoresStore, 'SectoresStore');
