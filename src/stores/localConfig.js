import Reflux from 'reflux';
import _ from 'lodash';
import actions from '../actions.js';


const CTC = 'CTC';

var config;

export default Reflux.createStore({
	listenables: actions,
	getInitialState: function () {
		if (!config) {
			// config = global.localStorage.getItem(CTC);
			if (!config) {
				config = {
					sectores: []
				};
				this.save(true);
			} else {
				config = JSON.parse(config);
			}
		}
		console.log('config', config);
		return config;
	},
	onSetLocalConfig: function (path, value) {
		console.log('onSetLocalConfig', path, value);
		var oldValue = _.get(config, path);
		if (value !== oldValue) {
			_.set(config, path, value);
			this.save();
		}
	},
	onCloseTabSector: function (nombre) {
		var sectores = config.sectores,
			index = sectores.indexOf(nombre);
		if (index > -1) {
			sectores.splice(index, 1);
			if (nombre === config.selected) {
				config.selected = sectores[0];
			}
			this.save();
		}
	},
	onOpenTabSector: function (nombre) {
		if (nombre === config.selected) return;
		if (config.sectores.indexOf(nombre) === -1) {
			config.sectores.push(nombre);
		}
		config.selected = nombre;
		this.save();
	},
	save: function (quiet) {
		console.log('saving new config', config, quiet);
		global.localStorage.setItem(CTC, JSON.stringify(config));
		if (!quiet) this.trigger(config);
	}
});
