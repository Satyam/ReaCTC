var Reflux = require('reflux');

import actions from '../actions.js';

var mensajes = [];

export default Reflux.createStore({
	listenables: actions,
	getInitialState: function () {
		return mensajes;
	},
	onTeletipo: function (data) {
		data.fecha = new Date();
		data.nivel = data.nivel || 0;
		mensajes.push(data);
		this.trigger(mensajes);
	}
});
