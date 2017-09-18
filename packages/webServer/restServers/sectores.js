import * as sectores from '../dbOperations/sectores';

export function getSector(req) {
  return sectores.getSector(req.params.idSector);
}

export function deleteSectores({ params }) {
  return sectores.deleteSectores(params.idSector.split(','));
}

export function addSector({ body }) {
  return sectores.addSector(body).catch((err) => {
    console.error(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      return Promise.reject({
        code: 409,
        msg: err.message,
      });
    }
    throw err;
  });
}

export default db =>
  sectores.init(db).then(() => ({
    '/:idSector': { read: getSector, delete: deleteSectores },
    '/': { read: sectores.listSectores, create: addSector },
  }));
