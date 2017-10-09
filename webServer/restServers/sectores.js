import * as sectores from '../dbOperations/sectores';
import ServerError from './serverError';

export function getSector(req) {
  return sectores.getSector(req.params.idSector);
}

export function deleteSectores({ params }) {
  return sectores.deleteSectores(params.idSector.split(','));
}

export async function addSector({ body }) {
  try {
    await sectores.addSector(body);
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      throw new ServerError(409, err.message);
    }
    throw err;
  }
}

export default async (db) => {
  await sectores.init(db);
  return {
    '/:idSector': { read: getSector, delete: deleteSectores },
    '/': { read: sectores.listSectores, create: addSector },
  };
};
