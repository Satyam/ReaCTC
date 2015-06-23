import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import actions from '../../actions.js';
import {ANCHO_CELDA} from '../../common/common.js';
// import _ from 'lodash';

require('./estado.less');

import estadoStore from '../../stores/estado.js';


export default React.createClass({
	mixins: [
		Reflux.connect(estadoStore, 'estado')
	],
	close: function () {
		actions.closeEstado();
	},
	render: function () {
		var s = this.state.estado;
		return s.visible ? (<div
			className= {'popover ' + s.side}
			role='tooltip'
			style={{
				top: s.top,
				left: s.left,
				display: (s.visible ? 'block' : 'none')
			}}
		>
			<div className="arrow" style={{top: ANCHO_CELDA / 2}}></div>
			<i className="fa fa-close" onClick={this.close}/>
			<h3 className="popover-title">{s.celda.tipo}</h3>
			<div className="popover-content">
				{s.celda.tipo === 'cambio' && (<Cambio celda={s.celda} nombreSector={s.nombreSector}/>)}
				{s.celda.tipo === 'triple' && (<Triple celda={s.celda} nombreSector={s.nombreSector}/>)}
				<pre>{JSON.stringify(s.celda, null, 2)}</pre>
			</div>
		</div>) : null;
	}
});

var Cambio = React.createClass({
	propTypes: {
		// <Cambio celda={s.celda} nombreSector={s.nombreSector}/>
		celda: PropTypes.shape({
			/*
			"tipo": "cambio",
			"punta":{"dir":"SE"},
			"normal":{"dir":"NW"},
			"invertido":{"dir":"W"},
			*/
			tipo: PropTypes.string.isRequired,
			punta: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
			normal: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
			invertido: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),

		}),
		nombreSector: PropTypes.string.isRequired
	},
	cambioNormal: function () {
		actions.cambio({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			desviado: false
		});
	},
	cambioDesviado: function () {
		actions.cambio({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			desviado: true
		});
	},
	manualAutomatico: function () {
		actions.manual({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			manual: false
		});
	},
	manualManual: function () {
		actions.manual({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			manual: true
		});
	},
	render: function () {
		var celda = this.props.celda;
		return (
			<div className="cambio form-horizontal">
				<div className="form-group">
					<label className="col-md-4">Cambio</label>
					<div className="btn-group col-md-8" role="group" aria-label="desviado">
						<button
							type="button"
							className={'btn btn-xs ' + (celda.desviado ? 'btn-inactivo' : 'btn-primary') }
							onClick={this.cambioNormal}
						>Normal</button>
						<button
							type="button"
							className={'btn btn-xs ' + (celda.desviado ? 'btn-warning' : 'btn-inactivo')}
							onClick={this.cambioDesviado}
						>Invertido</button>
					</div>
				</div>
				<div className="form-group">
					<label className="col-md-4">Manual</label>
					<div className="btn-group col-md-8" role="group" aria-label="manual">
						<button
							type="button"
							className={'btn btn-xs ' + (celda.manual ? 'btn-inactivo' : 'btn-primary')}
							onClick={this.manualAutomatico}
						>Automático</button>
						<button
							type="button"
							className={'btn btn-xs ' + (celda.manual ? 'btn-danger' : 'btn-inactivo')}
							onClick={this.manualManual}
						>Manual</button>
					</div>
				</div>
		</div>);
	}
});

var Triple = React.createClass({
	propTypes: {
		// <Triple celda={s.celda} nombreSector={s.nombreSector}/>
		celda: PropTypes.shape({
			/*
			"tipo": "triple",
			"punta":{"dir":"W"},
			"centro":{"dir":"E"},
			"izq":{"dir":"NE"},
			"der":{"dir":"SE"},
			*/
			tipo: PropTypes.string.isRequired,
			punta: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
			centro: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
			izq: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
			der: PropTypes.shape({
				dir:PropTypes.string.isRequired
			}),
		}),
		nombreSector: PropTypes.string.isRequired
	},
	cambioIzq: function () {
		actions.triple({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			posicion: -1
		});
	},
	cambioNormal: function () {
		actions.triple({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			posicion: 0
		});
	},
	cambioDer: function () {
		actions.triple({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			posicion: 1
		});
	},
	manualAutomatico: function () {
		actions.manual({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			manual: false
		});
	},
	manualManual: function () {
		actions.manual({
			nombreSector: this.props.nombreSector,
			coords: this.props.celda.coords,
			manual: true
		});
	},
	render: function () {
		var celda = this.props.celda;
		return (
			<div className="cambio form-horizontal">
				<div className="form-group">
					<label className="col-md-4">Cambio</label>
					<div className="btn-group col-md-8" role="group" aria-label="desviado">
						<button
							type="button"
							className={'btn btn-xs ' + (celda.posicion === -1 ? 'btn-warning' : 'btn-inactivo')}
							onClick={this.cambioIzq}
						>Izq.</button>
						<button
							type="button"
							className={'btn btn-xs ' + (celda.posicion ? 'btn-inactivo' : 'btn-primary') }
							onClick={this.cambioNormal}
						>Normal</button>
						<button
							type="button"
							className={'btn btn-xs ' + (celda.posicion === 1 ? 'btn-warning' : 'btn-inactivo')}
							onClick={this.cambioDer}
						>Der.</button>
					</div>
				</div>
				<div className="form-group">
					<label className="col-md-4">Manual</label>
					<div className="btn-group col-md-8" role="group" aria-label="manual">
						<button
							type="button"
							className={'btn btn-xs ' + (celda.manual ? 'btn-inactivo' : 'btn-primary')}
							onClick={this.manualAutomatico}
						>Automático</button>
						<button
							type="button"
							className={'btn btn-xs ' + (celda.manual ? 'btn-danger' : 'btn-inactivo')}
							onClick={this.manualManual}
						>Manual</button>
					</div>
				</div>
		</div>);
	}
});
