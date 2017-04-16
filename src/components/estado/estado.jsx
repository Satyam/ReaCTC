import React, { PropTypes } from 'react';
import actions from '../../actions.js';
import { Componente, ANCHO_CELDA } from '../../common/common.js';
import _ from 'lodash';

require('./estado.less');

import estadoStore from '../../stores/estado.js';

class Cambio extends React.Component {
  cambio(desviado) {
    actions.cambio({
      nombreSector: this.props.nombreSector,
      coords: this.props.celda.coords,
      desviado,
    });
  }
  manual(manual) {
    actions.manual({
      nombreSector: this.props.nombreSector,
      coords: this.props.celda.coords,
      manual,
    });
  }
  render() {
    var celda = this.props.celda;
    return (
      <div className="cambio form-horizontal">
        <div className="form-group">
          <label className="col-md-4">Cambio</label>
          <div className="btn-group col-md-8" role="group" aria-label="desviado">
            <button
              type="button"
              className={`btn btn-xs ${celda.desviado ? 'btn-inactivo' : 'btn-primary'}`}
              onClick={this.cambio.bind(this, false)}
            >
              Normal
            </button>
            <button
              type="button"
              className={`btn btn-xs ${celda.desviado ? 'btn-warning' : 'btn-inactivo'}`}
              onClick={this.cambio.bind(this, true)}
            >
              Invertido
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4">Manual</label>
          <div className="btn-group col-md-8" role="group" aria-label="manual">
            <button
              type="button"
              className={`btn btn-xs ${celda.manual ? 'btn-inactivo' : 'btn-primary'}`}
              onClick={this.manual.bind(this, false)}
            >
              Automático
            </button>
            <button
              type="button"
              className={`btn btn-xs ${celda.manual ? 'btn-danger' : 'btn-inactivo'}`}
              onClick={this.manual.bind(this, true)}
            >
              Manual
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Cambio.propTypes = {
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
      dir: PropTypes.string.isRequired,
    }),
    normal: PropTypes.shape({
      dir: PropTypes.string.isRequired,
    }),
    invertido: PropTypes.shape({
      dir: PropTypes.string.isRequired,
    }),
  }),
  nombreSector: PropTypes.string.isRequired,
};

class Triple extends React.Component {
  cambio(posicion) {
    actions.triple({
      nombreSector: this.props.nombreSector,
      coords: this.props.celda.coords,
      posicion,
    });
  }
  manual(manual) {
    actions.manual({
      nombreSector: this.props.nombreSector,
      coords: this.props.celda.coords,
      manual,
    });
  }
  render() {
    var celda = this.props.celda;
    return (
      <div className="cambio form-horizontal">
        <div className="form-group">
          <label className="col-md-4">Cambio</label>
          <div className="btn-group col-md-8" role="group" aria-label="desviado">
            <button
              type="button"
              className={`btn btn-xs ${celda.posicion === -1 ? 'btn-warning' : 'btn-inactivo'}`}
              onClick={this.cambio.bind(this, -1)}
            >
              Izq.
            </button>
            <button
              type="button"
              className={`btn btn-xs ${celda.posicion ? 'btn-inactivo' : 'btn-primary'}`}
              onClick={this.cambio.bind(this, 0)}
            >
              Normal
            </button>
            <button
              type="button"
              className={`btn btn-xs ${celda.posicion === 1 ? 'btn-warning' : 'btn-inactivo'}`}
              onClick={this.cambio.bind(this, 1)}
            >
              Der.
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-4">Manual</label>
          <div className="btn-group col-md-8" role="group" aria-label="manual">
            <button
              type="button"
              className={`btn btn-xs ${celda.manual ? 'btn-inactivo' : 'btn-primary'}`}
              onClick={this.manual.bind(this, false)}
            >
              Automático
            </button>
            <button
              type="button"
              className={`btn btn-xs ${celda.manual ? 'btn-danger' : 'btn-inactivo'}`}
              onClick={this.manual.bind(this, true)}
            >
              Manual
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Triple.propTypes = {
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
      dir: PropTypes.string.isRequired,
    }),
    centro: PropTypes.shape({
      dir: PropTypes.string.isRequired,
    }),
    izq: PropTypes.shape({
      dir: PropTypes.string.isRequired,
    }),
    der: PropTypes.shape({
      dir: PropTypes.string.isRequired,
    }),
  }),
  nombreSector: PropTypes.string.isRequired,
};

class Senal extends React.Component {
  estado(estado, luz) {
    // action constitucion 2,4,W senal { luz: 'der', estado: 'alto' }
    var p = this.props;
    actions.senal({
      nombreSector: p.nombreSector,
      coords: `${p.celda.coords},${p.senal}`,
      luz,
      estado,
    });
  }
  manual(manual, luz) {
    var p = this.props;
    actions.manual({
      nombreSector: p.nombreSector,
      coords: `${p.celda.coords},${p.senal}`,
      luz,
      manual,
    });
  }
  render() {
    var p = this.props,
      senal = p.celda.senales[p.senal];

    return (
      <div className="senal form-horizontal">
        {_.map(senal, (config, luz) => (
          <div className="form-group" key={luz}>
            <label className="col-md-4">{luz}</label>
            <div className="btn-group col-md-8" role="group" aria-label="manual">
              <button
                type="button"
                className={`btn btn-xs ${config.manual ? 'btn-inactivo' : 'btn-primary'}`}
                onClick={this.manual.bind(this, false, luz)}
              >
                Automático
              </button>
              <button
                type="button"
                className={`btn btn-xs ${config.manual ? 'btn-danger' : 'btn-inactivo'}`}
                onClick={this.manual.bind(this, true, luz)}
              >
                Manual
              </button>
            </div>
            <div
              className={`btn-group col-md-8 col-md-offset-4 ${config.estado}`}
              role="group"
              aria-label="estado"
            >
              <button
                type="button"
                className="btn btn-xs libre"
                onClick={this.estado.bind(this, 'libre', luz)}
              >
                Libre
              </button>
              <button
                type="button"
                className="btn btn-xs precaucion"
                onClick={this.estado.bind(this, 'precaucion', luz)}
              >
                Precaución
              </button>
              <button
                type="button"
                className="btn btn-xs alto"
                onClick={this.estado.bind(this, 'alto', luz)}
              >
                Alto
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default class Estado extends Componente {
  getStores() {
    return [estadoStore];
  }
  close() {
    actions.closeEstado();
  }
  render() {
    var s = this.state.estado;

    if (_.isEmpty(s)) return null;
    var Content = (s.senal ? Senal : { cambio: Cambio, triple: Triple }[s.celda.tipo]) || null;
    return s.visible
      ? <div
        className={`popover ${s.side}`}
        role="tooltip"
        style={{
          top: s.top,
          left: s.left,
          display: s.visible ? 'block' : 'none',
        }}
      >
        <div className="arrow" style={{ top: ANCHO_CELDA / 2 }} />
        <i className="fa fa-close" onClick={this.close.bind(this)} />
        <h3 className="popover-title">{s.senal ? `Señal ${s.senal}` : s.celda.tipo}</h3>
        <div className="popover-content">
          {Content && <Content celda={s.celda} nombreSector={s.nombreSector} senal={s.senal} />}
          <pre>{JSON.stringify(s.celda, null, 2)}</pre>
        </div>
      </div>
      : null;
  }
}
