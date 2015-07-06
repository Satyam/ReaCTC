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
			this.timer = global.setInterval(() => {
				this.errores.shift();
				if (!this.errores.length) {
					global.clearInterval(this.timer);
					this.timer = null;
				}
				this.emitChange();
			}, 10000);
		}
	}
}

export default alt.createStore(ErroresStore, 'ErroresStore');
