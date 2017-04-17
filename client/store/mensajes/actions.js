import { ADD_MENSAJE } from './constants';

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
