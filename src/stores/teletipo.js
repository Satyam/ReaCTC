import alt from '../alt.js';
import actions from '../actions.js';


class TeletipoStore {
	constructor() {
		this.mensajes = [];
		this.bindAction(actions.teletipo, this.onTeletipo);
	}
	onTeletipo (data) {
		data.fecha = new Date();
		data.nivel = data.nivel || 0;
		this.mensajes.push(data);
	}
}

export default alt.createStore(TeletipoStore, 'TeletipoStore');
