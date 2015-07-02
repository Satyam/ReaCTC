import alt from '../alt.js';
import actions from '../actions.js';


class ErroresStore {
	constructor() {
		this.errores = [];
		this.bindAction(actions.error, this.onError);
	}
	onError (msg) {
		this.errores.push({
			fecha: new Date(),
			msg: msg
		});
		this.anejar();
	}
	anejar () {
		if (!this.timer) {
			this.timer = global.setTimeout(() => {
				this.errores.shift();
				if (this.errores.length) this.anejar();
				this.emitChange();
			}, 10000);
		}
	}
}

export default alt.createStore(ErroresStore, 'ErroresStore');
