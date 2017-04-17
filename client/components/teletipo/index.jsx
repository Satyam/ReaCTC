import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selMensajes } from '_store/selectors';

const colores = ['', 'warning', 'danger'];

export function TeletipoComponent({ mensajes }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Sector</th>
          <th>Celda</th>
          <th>Mensaje</th>
        </tr>
      </thead>
      <tbody>
        {mensajes.map(row => (
          <tr className={colores[row.nivel]} key={row.fecha.getTime()}>
            <td>{row.fecha.toLocaleString()}</td>
            <td>{row.sector}</td>
            <td>{row.coords}</td>
            <td>{row.msg}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TeletipoComponent.propTypes = {
  mensajes: PropTypes.arrayOf({
    fecha: PropTypes.instanceOf(Date),
    sector: PropTypes.string,
    coords: PropTypes.string,
    msg: PropTypes.string,
    nivel: PropTypes.number,
  }),
};
export const mapStateToProps = state => selMensajes(state);

export default connect(mapStateToProps)(TeletipoComponent);
