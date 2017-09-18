let collection;

export function setCambio({ idCelda, posicion }) {
  return collection.updateOne({ _id: idCelda }, { $set: { posicion } });
}

export function setCambioManual({ idCelda, manual }) {
  return collection.updateOne({ _id: idCelda }, { $set: { manual } });
}

export function init(db) {
  collection = collection || db.collection('sectores');
  return Promise.resolve();
}
