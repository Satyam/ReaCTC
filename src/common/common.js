export const ANCHO_CELDA = 100,
	CENTRO_CELDA = ANCHO_CELDA / 2,
	X = {
		N: CENTRO_CELDA,
		NE: ANCHO_CELDA,
		E: ANCHO_CELDA,
		SE: ANCHO_CELDA,
		S: CENTRO_CELDA,
		SW: 0,
		W: 0,
		NW: 0
	},
	Y = {
		N: 0,
		NE: 0,
		E: CENTRO_CELDA,
		SE: ANCHO_CELDA,
		S: ANCHO_CELDA,
		SW: ANCHO_CELDA,
		W: CENTRO_CELDA,
		NW: 0
	},
	ANG = {
		N: 270,
		NE: 315,
		E: 0,
		SE: 45,
		S: 90,
		SW: 135,
		W: 180,
		NW: 225
	},
	DIR = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function splitCoords (coords) {
	var parts = coords.split(',');
	return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}

export function leftButton (ev) {
	if (ev.button !== 0) return false;
	if (ev.metaKey || ev.altKey || ev.ctrlKey || ev.shiftKey) return false;
	ev.preventDefault();
	ev.stopPropagation();
	return true;
}

import React from 'react';
import _ from 'lodash';

export class Componente extends React.Component {
	constructor (props, context) {
		super(props, context);
		// this._stores = this.get;
		this.state = {};
		this._unlisteners = _.map(this.getStores(), store => {
			_.merge(this.state, store.getState());
			return store.listen(state => {
				this.setState(state);
			});
		});
	}
//	constructor (props, context, stores) {
//		super(props, context);
//		this._stores = stores;
//		this.state = {};
//		_.each(stores, store => {
//			_.merge(this.state, store.getState());
//		});
//	}
//	componentDidMount () {
//		this._unlisteners = _.map(this._stores, store => {
//			return store.listen(state => {
//				this.setState(state);
//			});
//		});
//	}
	componentWillUnmount () {
		this._unlisteners.forEach(u => u());
	}
}

