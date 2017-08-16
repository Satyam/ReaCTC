import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

let collection;

export function addSenales({ body }) {
  if (isEmpty(body.senales)) return null;
  return collection
    .insertMany(
      map(body.senales, (senal, idSenal) => Object.assign(senal, { _id: idSenal, idSenal }))
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

export function getSenales(idSector) {
  return collection.find({ idSector }).toArray();
}

export default (db) => {
  collection = db.collection('senales');
  return Promise.resolve({
    '/': { create: addSenales },
  });
};
