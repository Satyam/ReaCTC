import firebaseConnect from '_utils/firebase/connect';

import isPlainClick from '_utils/isPlainClick';

import Cambio, { DESVIADO, NORMAL } from '_components/estado/cambio';

export const firebaseDataMap = ({ idCelda }) => ({
  $: `celdas/${idCelda}`,
});

export const firebaseActionsMap = (database, { idCelda }) => {
  const posicion = database.ref(`celdas/${idCelda}/posicion`);
  const manual = database.ref(`celdas/${idCelda}/manual`);
  return {
    onSetCambioNormal: ev => isPlainClick(ev) && posicion.set(NORMAL),
    onSetCambioDesviado: ev => isPlainClick(ev) && posicion.set(DESVIADO),
    onSetManual: value => manual.set(value),
  };
};

export default firebaseConnect(firebaseDataMap, firebaseActionsMap)(Cambio);
