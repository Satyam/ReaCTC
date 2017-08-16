import values from 'lodash/values';

import { addCeldas, getCeldas } from './celdas';
import { addSenales, getSenales } from './senales';
import { addEnclavamientos, getEnclavamientos } from './enclavamientos';

let collection;

export function listSectores() {
  return collection.find({}, { idSector: 1, descrCorta: 1, descr: 1, _id: 0 }).toArray();
}

export function getSector(req) {
  const idSector = req.params.idSector;
  return Promise.all([
    collection.find({ _id: idSector }).next(),
    getCeldas(idSector),
    getSenales(idSector),
    getEnclavamientos(idSector),
  ]).then(finds => ({
    sectores: finds[0],
    celdas: finds[1],
    senales: finds[2],
    enclavamientos: finds[3],
  }));
}

export function deleteSectores({ params }) {
  return collection.deleteMany({ idSector: { $in: params.idSector.split(',') } });
}

export function addSector(req) {
  const sectores = values(req.body.sectores)[0];
  return Promise.all([
    collection.insertOne(Object.assign(sectores, { _id: sectores.idSector })).catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        return Promise.reject({
          code: 409,
          msg: 'idSector duplicado',
        });
      }
      throw err;
    }),
    addCeldas(req),
    addSenales(req),
    addEnclavamientos(req),
  ]);
}

export default (db) => {
  collection = db.collection('sectores');
  return Promise.resolve({
    '/:idSector': { read: getSector, delete: deleteSectores },
    '/': { read: listSectores, create: addSector },
  });
};
