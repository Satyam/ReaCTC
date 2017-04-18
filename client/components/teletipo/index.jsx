import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';

import { selMensajes } from '_store/selectors';

import styles from './styles.css';

const colores = ['normal', 'warning', 'danger'];

export function TeletipoComponent({ mensajes }) {
  return (
    <Table selectable={false}>
      <TableHead>
        <TableCell>Fecha</TableCell>
        <TableCell>Sector</TableCell>
        <TableCell>Celda</TableCell>
        <TableCell>Mensaje</TableCell>
      </TableHead>
      {mensajes.map(row => (
        <TableRow className={styles[colores[row.nivel]]} key={row.fecha.getTime()}>
          <TableCell>{row.fecha.toLocaleString()}</TableCell>
          <TableCell>{row.sector}</TableCell>
          <TableCell>{row.coords}</TableCell>
          <TableCell>{row.msg}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

TeletipoComponent.propTypes = {
  mensajes: PropTypes.arrayOf(
    PropTypes.shape({
      fecha: PropTypes.instanceOf(Date),
      sector: PropTypes.string,
      coords: PropTypes.string,
      msg: PropTypes.string,
      nivel: PropTypes.number,
    })
  ),
};
export const mapStateToProps = state => ({ mensajes: selMensajes(state) });

export default connect(mapStateToProps)(TeletipoComponent);
