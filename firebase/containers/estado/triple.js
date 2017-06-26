import firebaseConnect from '_utils/firebase/connect';

import isPlainClick from '_utils/isPlainClick';

import Triple, { IZQ, CENTRO, DER } from '_components/estado/triple';

export const firebaseDataMap = ({ idCelda }) => ({
  $: `celdas/${idCelda}`,
});

export const firebaseActionsMap = (database, { idCelda }) => {
  const posicion = database.ref(`celdas/${idCelda}/posicion`);
  const manual = database.ref(`celdas/${idCelda}/manual`);
  return {
    onSetNormal: ev => isPlainClick(ev) && posicion.set(CENTRO),
    onSetIzq: ev => isPlainClick(ev) && posicion.set(IZQ),
    onSetDer: ev => isPlainClick(ev) && posicion.set(DER),
    onSetManual: value => manual.set(value),
  };
};

export default firebaseConnect(firebaseDataMap, firebaseActionsMap)(Triple);
