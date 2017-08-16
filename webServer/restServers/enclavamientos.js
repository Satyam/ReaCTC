import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

let collection;

export function addEnclavamientos({ body }) {
  if (isEmpty(body.enclavamientos)) return null;
  return collection
    .insertMany(
      map(body.enclavamientos, (enclavamiento, idEnclavamiento) =>
        Object.assign(enclavamiento, { _id: idEnclavamiento, idEnclavamiento })
      )
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

export function getEnclavamientos(idSector) {
  return collection.find({ idSector }).toArray();
}

export default (db) => {
  collection = db.collection('enclavamientos');
  return Promise.resolve({
    '/': { create: addEnclavamientos },
  });
};
