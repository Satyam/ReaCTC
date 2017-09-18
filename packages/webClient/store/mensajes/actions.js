import { ADD_MENSAJE } from './constants';
/* eslint-disable import/prefer-default-export */

export function addMensaje(idSector, coords, nivel, mensaje) {
  return {
    type: ADD_MENSAJE,
    payload: {
      idSector,
      coords,
      nivel,
      mensaje,
      fecha: new Date(),
    },
  };
}
