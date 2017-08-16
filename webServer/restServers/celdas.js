import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

let collection;

export function addCeldas({ body }) {
  if (isEmpty(body.celdas)) return null;
  return collection
    .insertMany(
      map(body.celdas, (celda, idCelda) => Object.assign(celda, { _id: idCelda, idCelda }))
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return Promise.reject({
          code: 409,
          msg: 'idSector duplicado',
        });
      }
      throw err;
    });
}

export function getCeldas(idSector) {
  return collection.find({ idSector }).toArray();
}

export default (db) => {
  collection = db.collection('celdas');
  return Promise.resolve({
    '/': { create: addCeldas },
  });
};
